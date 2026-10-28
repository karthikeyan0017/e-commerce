import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Eye, Sparkles, MessageSquarePlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [activeImage, setActiveImage] = useState(product?.imageUrl || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);

  if (!product) return null;

  const images = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);
  const isOutOfStock = product.countInStock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('Please sign in to leave a review', 'info');
      return;
    }
    if (!newComment.trim()) {
      showToast('Please enter your review thoughts', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newRating, comment: newComment })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Review published to Zilo Atelier!', 'success');
        setReviewsList((prev) => [
          ...prev,
          {
            name: user.name,
            rating: newRating,
            comment: newComment,
            createdAt: new Date()
          }
        ]);
        setNewComment('');
      } else {
        showToast(data.message || 'Error submitting review', 'error');
      }
    } catch (err) {
      showToast('Network error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const colorSwatches = [
    { name: 'Obsidian Black', hex: '#111111' },
    { name: 'Havana Tortoise', hex: '#5c3a21' },
    { name: 'Champagne Crystal', hex: '#e8dcce' },
    { name: 'Silver Titanium', hex: '#b0b3b8' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 880 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-dark">{product.category}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-bronze)' }}>
              {product.brand || 'ZILO ATELIER'}
            </span>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {/* Gallery Column */}
            <div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={activeImage || product.imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      style={{
                        width: 65,
                        height: 65,
                        borderRadius: 'var(--radius-xs)',
                        overflow: 'hidden',
                        border: activeImage === imgUrl ? '2px solid #111111' : '1px solid var(--border-color)',
                        flexShrink: 0,
                        cursor: 'pointer',
                        padding: 0,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.35rem' }}>
                {product.name}
              </h2>

              {/* Rating & reviews count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', color: '#eab308' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating || 5) ? '#eab308' : 'none'}
                      stroke="#eab308"
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{product.rating?.toFixed(1) || '4.9'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  ({reviewsList.length || product.numReviews || 35} reviews)
                </span>
              </div>

              {/* Price display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="badge badge-sale">
                    SAVE ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Acetate Swatch Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  Selected Finish: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(swatch.name)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: swatch.hex,
                        border: selectedColor === swatch.name ? '2px solid #111111' : '1px solid rgba(0,0,0,0.15)',
                        outline: selectedColor === swatch.name ? '2px solid var(--accent-bronze)' : 'none',
                        outlineOffset: 2,
                        cursor: 'pointer'
                      }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>

              {/* Features / Specs */}
              {product.features && product.features.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    Key Specifications & Features
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {product.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-bronze)', flexShrink: 0 }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '0.4rem 0.8rem', fontWeight: 700, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.4rem 0.8rem', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.countInStock || 99, quantity + 1))}
                      style={{ padding: '0.4rem 0.8rem', fontWeight: 700, color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: isOutOfStock ? '#ef4444' : 'var(--text-muted)' }}>
                    {isOutOfStock ? 'Sold Out' : `${product.countInStock} units in stock`}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '0.85rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>{isOutOfStock ? 'Currently Sold Out' : 'Add to Shopping Bag'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MessageSquarePlus size={20} color="var(--accent-bronze)" />
              Customer Reviews ({reviewsList.length})
            </h3>

            {/* Review form */}
            <form
              onSubmit={handleReviewSubmit}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {user ? `Leave a review as ${user.name}` : 'Sign in to write a verified review'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Rating:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="select-custom"
                >
                  <option value={5}>5 Stars — Exquisite Craftsmanship</option>
                  <option value={4}>4 Stars — Very Good Optical Fit</option>
                  <option value={3}>3 Stars — Average Quality</option>
                  <option value={2}>2 Stars — Poor Fit</option>
                  <option value={1}>1 Star — Unsatisfied</option>
                </select>
              </div>

              <textarea
                rows={3}
                placeholder={user ? "Describe the frame fit, lens clarity, weight, and everyday feel..." : "Please sign in to share your review."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user}
                className="input-field"
                style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
              />

              <button
                type="submit"
                disabled={!user || submittingReview}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.75rem' }}
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviewsList.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  No customer reviews yet. Be the first to review this optical frame!
                </div>
              ) : (
                reviewsList.map((rev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.name}</span>
                      <div style={{ display: 'flex', color: '#eab308' }}>
                        {[...Array(rev.rating || 5)].map((_, idx) => (
                          <Star key={idx} size={13} fill="#eab308" stroke="#eab308" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
