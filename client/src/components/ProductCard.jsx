import React from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.countInStock === 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="product-card">
      {/* Top Media & Badges */}
      <div className="product-card-media" onClick={() => onQuickView(product)}>
        <div className="product-card-badges">
          {product.isFeatured && (
            <span className="badge badge-dark">Best Seller</span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-new">New Arrival</span>
          )}
          {discountPercent > 0 && (
            <span className="badge badge-sale">-{discountPercent}%</span>
          )}
        </div>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="product-card-quickview">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.72rem' }}
          >
            <Eye size={13} /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="product-card-body">
        <div className="product-card-category">
          {product.brand || 'ZILO'} • {product.category}
        </div>

        <h3
          className="product-card-title"
          onClick={() => onQuickView(product)}
        >
          {product.name}
        </h3>

        <p className="product-card-specs">
          {product.description}
        </p>

        {/* Ratings & Stock note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <Star size={13} fill="#eab308" color="#eab308" />
            <span style={{ fontWeight: 700 }}>{product.rating || 4.9}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.numReviews || 35})</span>
          </div>

          {isLowStock ? (
            <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
              Only {product.countInStock} left
            </span>
          ) : isOutOfStock ? (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>
              Out of stock
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              In Stock
            </span>
          )}
        </div>

        {/* Footer with Price & Add to Bag */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="product-price-current">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="btn-card-add"
            title={isOutOfStock ? 'Currently out of stock' : 'Add item to shopping bag'}
          >
            <ShoppingBag size={13} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
