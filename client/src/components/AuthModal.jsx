import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, quickLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (isRegister) {
      result = await register(formData.name, formData.email, formData.password, formData.role);
    } else {
      result = await login(formData.email, formData.password);
    }

    setLoading(false);
    if (result && result.success) {
      onClose();
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    const result = await quickLogin(role);
    setLoading(false);
    if (result && result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {isRegister ? 'Create an Account' : 'Welcome to AuraCommerce'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {isRegister ? 'Join our community of technology enthusiasts' : 'Sign in to access your orders and profile'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick 1-Click Demo Logins Banner */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--accent-primary)',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              ⚡ 1-Click Demo Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
                disabled={loading}
              >
                <User size={14} />
                <span>Customer User</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                disabled={loading}
              >
                <ShieldCheck size={14} />
                <span>Store Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">Regular Shopper (User)</option>
                  <option value="admin">Store Manager (Admin)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In to Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem' }}>
            {isRegister ? (
              <span style={{ color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ color: 'var(--accent-primary)', fontWeight: 700 }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ color: 'var(--accent-primary)', fontWeight: 700 }}
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
