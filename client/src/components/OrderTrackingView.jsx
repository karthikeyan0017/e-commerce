import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const OrderTrackingView = ({ initialOrderNumber }) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || 'ORD-894125');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchOrderTracking = async (numberToTrack) => {
    const q = (numberToTrack || orderQuery).trim();
    if (!q) {
      showToast('Please enter an order number', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${q}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.message || `No tracking data found for "${q}".`);
      }
    } catch (err) {
      setError('Network error connecting to tracking service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderQuery) {
      fetchOrderTracking(orderQuery);
    }
  }, []);

  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStatusIndex = (currentStatus) => {
    const idx = statuses.indexOf(currentStatus);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = order ? getStatusIndex(order.orderStatus) : 0;

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <Truck size={16} />
            Real-Time Logistics
          </div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
            Track Your Consignment
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto' }}>
            Enter your unique order number to inspect warehouse fulfillment, carrier handover, transit checkpoints, and destination delivery.
          </p>
        </div>

        {/* Tracking Search Input Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrderTracking();
            }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Enter Order # (e.g. ORD-894125 or ORD-762914)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                style={{
                  paddingLeft: '2.6rem',
                  fontSize: '1rem',
                  height: 48,
                  fontWeight: 600
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 150 }}
            >
              {loading ? 'Searching...' : 'Track Package'}
            </button>
          </form>

          {/* Quick Demo Lookup Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Try Sample Orders:</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('ORD-894125');
                fetchOrderTracking('ORD-894125');
              }}
              className="badge badge-new"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              ORD-894125 (In Transit)
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('ORD-762914');
                fetchOrderTracking('ORD-762914');
              }}
              className="badge badge-success"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              ORD-762914 (Delivered)
            </button>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--badge-sale-bg)',
              color: 'var(--badge-sale-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            <AlertCircle size={24} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700 }}>Order Search Error</div>
              <div style={{ fontSize: '0.88rem' }}>{error}</div>
            </div>
          </div>
        )}

        {/* Tracking Details Display */}
        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Overview Status Card */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    CONSIGNMENT NUMBER
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                    {order.orderNumber}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <Calendar size={14} />
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-new'}`}
                    style={{ fontSize: '0.88rem', padding: '0.4rem 0.9rem' }}
                  >
                    {order.orderStatus}
                  </span>
                  {order.estimatedDelivery && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Est. Arrival: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Stepper Bar (Horizontal) */}
              <div style={{ margin: '2rem 0 1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  {/* Background connecting bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 18,
                      left: '5%',
                      right: '5%',
                      height: 4,
                      backgroundColor: 'var(--border-color)',
                      zIndex: 1
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#10b981',
                        width: `${(currentStepIdx / (statuses.length - 1)) * 100}%`,
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>

                  {statuses.map((st, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div
                        key={st}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 2,
                          textAlign: 'center',
                          flex: 1
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isCurrent ? 'var(--accent-primary)' : isCompleted ? '#10b981' : 'var(--bg-secondary)',
                            color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                            border: `3px solid ${isCurrent ? 'var(--accent-primary)' : isCompleted ? '#10b981' : 'var(--border-color)'}`,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            boxShadow: isCurrent ? '0 0 0 5px var(--accent-light)' : 'none',
                            transition: 'var(--transition)'
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                        </div>
                        <span
                          style={{
                            marginTop: '0.65rem',
                            fontSize: '0.8rem',
                            fontWeight: isCurrent || isCompleted ? 700 : 500,
                            color: isCurrent ? 'var(--accent-primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                          }}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Split Details: Timeline Logs & Order Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* Timeline Log Feed */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--accent-primary)" />
                  Checkpoint History
                </h3>

                <div style={{ paddingLeft: '0.5rem' }}>
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, idx) => (
                      <div key={idx} className="timeline-step completed">
                        <div className="step-marker">
                          <CheckCircle2 size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                              {event.status}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {new Date(event.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                            {event.description}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={12} />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      No timeline events logged yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Order Package & Destination Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Destination Card */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={18} color="var(--accent-primary)" />
                    Delivery Destination
                  </h4>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.shippingAddress.fullName}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {order.shippingAddress.street}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Contact: {order.shippingAddress.phone} • {order.shippingAddress.email}
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={18} color="var(--accent-primary)" />
                    Order Items ({order.orderItems?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          paddingBottom: '0.75rem',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Qty: {item.qty} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                          ${(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                      <span>${order.itemsPrice?.toFixed(2)}</span>
                    </div>
                    {order.discountPrice > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '0.25rem' }}>
                        <span>Voucher Discount:</span>
                        <span>-${order.discountPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Transit:</span>
                      <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <span>Total Paid:</span>
                      <span className="text-gradient">${order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
