import React, { useState, useEffect } from 'react';
import { Package, Truck, Calendar, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserOrdersView = ({ onTrackOrder, onShop }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyOrders();
    }
  }, [token]);

  return (
    <div style={{ padding: '3.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Customer Portal
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>
              Your Order History
            </h2>
          </div>

          <button onClick={fetchMyOrders} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ color: 'var(--text-muted)' }}>Loading your past orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders placed yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You haven't completed any purchases with this account. Check out our high-performance gear!
            </p>
            <button onClick={onShop} className="btn btn-primary">
              <span>Browse Online Store</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((ord) => (
              <div key={ord._id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>ORDER NUMBER</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                      {ord.orderNumber}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <Calendar size={13} />
                      {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${ord.orderStatus === 'Delivered' ? 'badge-success' : 'badge-new'}`}>
                      {ord.orderStatus}
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem' }}>
                      ${ord.totalPrice?.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  {ord.orderItems?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => onTrackOrder(ord.orderNumber)}
                    className="btn btn-primary btn-sm"
                  >
                    <Truck size={14} />
                    <span>Live Tracking Stepper</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
