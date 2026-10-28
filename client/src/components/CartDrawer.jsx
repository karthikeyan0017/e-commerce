import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    promoCode,
    setPromoCode,
    appliedPromo,
    applyPromo,
    removePromo,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Cart</h3>
            <span className="badge badge-new">{cartItems.length} items</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Items Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>🛍️</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Your cart is empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Looks like you haven't added any products to your cart yet.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      backgroundColor: 'var(--bg-secondary)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product, item.qty - 1)}
                          style={{ padding: '0.2rem 0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: 26, textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.qty + 1)}
                          style={{ padding: '0.2rem 0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ color: '#ef4444', display: 'flex', alignItems: 'center', padding: '0.3rem', cursor: 'pointer' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations & Checkout */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Promo Code Box */}
            <div>
              {appliedPromo ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--badge-success-bg)',
                    color: 'var(--badge-success-text)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={16} />
                    <span>{appliedPromo.label} ({appliedPromo.code})</span>
                  </div>
                  <button onClick={removePromo} style={{ color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}>
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Promo code (ZILO15, SAVE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{ paddingLeft: '2.1rem', fontSize: '0.85rem', height: 38 }}
                    />
                  </div>
                  <button
                    onClick={() => applyPromo(promoCode)}
                    className="btn btn-secondary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount:</span>
                  <span style={{ fontWeight: 600 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Transit Shipping:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${taxAmount.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <span>Total Amount:</span>
                <span className="text-gradient">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
