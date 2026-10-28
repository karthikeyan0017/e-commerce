import React, { useState } from 'react';
import { X, Check, CreditCard, Truck, ShieldCheck, MapPin, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cartItems, subtotal, discountAmount, appliedPromo, clearCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment, 4: Review, 5: Success
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || 'Alex Rivera',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+1 (555) 234-5678',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'USA'
  });

  const [deliveryMethod, setDeliveryMethod] = useState('Standard'); // 'Standard', 'Express', 'Priority'
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // 'Credit Card', 'Cash on Delivery', 'UPI / NetBanking'

  // Card details mock
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8892',
    name: user?.name || 'Alex Rivera',
    expiry: '09/28',
    cvv: '342'
  });

  if (!isOpen) return null;

  // Shipping cost by delivery method
  let shippingPrice = 0;
  if (deliveryMethod === 'Priority') shippingPrice = 19.99;
  else if (deliveryMethod === 'Express') shippingPrice = 9.99;
  else shippingPrice = subtotal > 150 ? 0 : 7.99;

  if (appliedPromo && appliedPromo.type === 'free_shipping') {
    shippingPrice = 0;
  }

  const taxPrice = Math.max(0, (subtotal - discountAmount) * 0.08);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingPrice + taxPrice);

  const handleInputChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!shippingData.fullName || !shippingData.street || !shippingData.city) {
      showToast('Please fill in complete shipping details', 'error');
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image
        })),
        shippingAddress: shippingData,
        deliveryMethod,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        discountPrice: discountAmount,
        taxPrice,
        totalPrice: finalTotal,
        promoCode: appliedPromo?.code || ''
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Error processing order');
      }

      setPlacedOrder(data.order);
      clearCart();
      setStep(5); // Success confirmation view
      showToast(`Order ${data.order.orderNumber} placed successfully!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={step === 5 ? () => {} : onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 780 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {step === 5 ? 'Order Confirmed!' : 'Secure Checkout'}
            </h3>
            {step < 5 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {step} of 4: {step === 1 ? 'Shipping Destination' : step === 2 ? 'Transit Speed' : step === 3 ? 'Payment Method' : 'Order Review'}
              </div>
            )}
          </div>
          {step < 5 && (
            <button onClick={onClose} className="btn-icon" aria-label="Close checkout">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress Stepper Bar */}
        {step < 5 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            {['1. Shipping', '2. Delivery', '3. Payment', '4. Review'].map((label, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: step === idx + 1 ? 'var(--accent-primary)' : step > idx + 1 ? '#10b981' : 'var(--text-muted)',
                  borderBottom: step === idx + 1 ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  background: step === idx + 1 ? 'var(--bg-surface)' : 'transparent',
                  transition: 'var(--transition)'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="modal-body">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--accent-primary)" />
                Recipient & Destination Address
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingData.street}
                    onChange={handleInputChange}
                    placeholder="123 Innovation Way, Apt 4B"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    placeholder="Portland"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>State / Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    placeholder="OR"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ZIP / Postal Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingData.zipCode}
                    onChange={handleInputChange}
                    placeholder="97201"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--accent-primary)" />
                Choose Delivery Speed
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'Standard', name: 'Standard Transit', time: '5 - 7 business days', cost: subtotal > 150 ? 'FREE' : '$7.99' },
                  { id: 'Express', name: 'Express Courier', time: '2 - 3 business days', cost: '$9.99' },
                  { id: 'Priority', name: 'Priority Overnight Air', time: 'Next business day by 12 PM', cost: '$19.99' }
                ].map((option) => (
                  <label
                    key={option.id}
                    onClick={() => setDeliveryMethod(option.id)}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      border: deliveryMethod === option.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: deliveryMethod === option.id ? 'var(--accent-light)' : 'var(--bg-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === option.id}
                        onChange={() => setDeliveryMethod(option.id)}
                        style={{ width: 'auto', accentColor: 'var(--accent-primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{option.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{option.time}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {option.cost}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="var(--accent-primary)" />
                Select Payment Mode
              </h4>

              {/* Payment selector tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {['Credit Card', 'Cash on Delivery', 'UPI / NetBanking'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`btn ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ padding: '0.65rem 0.5rem', fontSize: '0.82rem' }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Credit Card' && (
                <div>
                  {/* Visual Card Mockup */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                      color: '#ffffff',
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 10px 25px rgba(49, 46, 129, 0.4)',
                      marginBottom: '1.5rem',
                      maxWidth: 380,
                      margin: '0 auto 1.5rem auto'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.8 }}>AURAPAY PLATINUM</span>
                      <CreditCard size={24} />
                    </div>
                    <div style={{ fontSize: '1.25rem', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                      {cardData.number}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <div>
                        <div style={{ opacity: 0.7 }}>CARDHOLDER</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cardData.name}</div>
                      </div>
                      <div>
                        <div style={{ opacity: 0.7 }}>EXPIRES</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cardData.expiry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>CVV / Security Code</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💵</div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Cash on Delivery Selected</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Pay safely in cash or digital scan when the parcel courier arrives at your doorstep.
                  </p>
                </div>
              )}

              {paymentMethod === 'UPI / NetBanking' && (
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Instant UPI / QR Portal</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Instant verification with Google Pay, PhonePe, Apple Pay, or direct internet banking.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW & PLACE ORDER */}
          {step === 4 && (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>Review & Place Your Order</h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Shipping summary card */}
                <div className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
                    DELIVERY ADDRESS
                  </div>
                  <div style={{ fontWeight: 600 }}>{shippingData.fullName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {shippingData.street}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {shippingData.phone} • {shippingData.email}
                  </div>
                </div>

                {/* Method & Payment summary card */}
                <div className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
                    DISPATCH & PAYMENT
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>Speed:</strong> {deliveryMethod} (${shippingPrice.toFixed(2)})
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>Payment:</strong> {paymentMethod}
                  </div>
                  {appliedPromo && (
                    <div style={{ fontSize: '0.82rem', color: '#10b981', marginTop: '0.2rem' }}>
                      Promo: {appliedPromo.code} applied
                    </div>
                  )}
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: '1.25rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Final Totals Table */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Items Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', marginBottom: '0.25rem' }}>
                    <span>Voucher Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Delivery Transit:</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span>Estimated Tax:</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                  <span>Total Due:</span>
                  <span className="text-gradient">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS & TRACKING CALLOUT */}
          {step === 5 && placedOrder && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--badge-success-bg)',
                  color: 'var(--badge-success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                Thank You for Your Order!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem auto' }}>
                Your order is confirmed and packaging has been initialized at our logistics depot.
              </p>

              {/* Order Tracking Callout Box */}
              <div
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  maxWidth: 460,
                  margin: '0 auto 2rem auto',
                  background: 'var(--bg-secondary)',
                  border: '2px dashed var(--accent-primary)'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Your Tracking ID
                </div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    fontFamily: 'monospace',
                    color: 'var(--accent-primary)',
                    margin: '0.4rem 0'
                  }}
                >
                  {placedOrder.orderNumber}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Save this tracking code to check real-time progress anytime.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    onClose();
                    onOrderPlaced(placedOrder.orderNumber);
                  }}
                  className="btn btn-primary btn-lg"
                >
                  <Truck size={18} />
                  <span>Track This Order Now</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn btn-secondary btn-lg"
                >
                  Back to Store
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 5 && (
          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Authorizing Order...' : `Confirm & Pay $${finalTotal.toFixed(2)}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
