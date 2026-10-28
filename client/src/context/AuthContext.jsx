import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auracommerce_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auracommerce_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('auracommerce_user', JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          logout(false);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auracommerce_token', data.token);
      localStorage.setItem('auracommerce_user', JSON.stringify(data.user));

      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auracommerce_token', data.token);
      localStorage.setItem('auracommerce_user', JSON.stringify(data.user));

      showToast(`Account created successfully! Welcome, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const quickLogin = async (role) => {
    if (role === 'admin') {
      return await login('admin@example.com', 'admin123');
    } else {
      return await login('user@example.com', 'user123');
    }
  };

  const logout = (notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auracommerce_token');
    localStorage.removeItem('auracommerce_user');
    if (notify) {
      showToast('You have been signed out.', 'info');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Update failed');
      }
      setUser(data.user);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('auracommerce_token', data.token);
      }
      localStorage.setItem('auracommerce_user', JSON.stringify(data.user));
      showToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        quickLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
