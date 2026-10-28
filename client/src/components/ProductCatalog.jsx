import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RefreshCw, X, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductCatalog = ({ searchQuery, onQuickView, activeCategory, onCategoryChange }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [internalCategory, setInternalCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(750);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync external category if passed
  useEffect(() => {
    if (activeCategory) {
      setInternalCategory(activeCategory === 'All Products' ? 'All' : activeCategory);
    }
  }, [activeCategory]);

  const selectedCategory = activeCategory
    ? (activeCategory === 'All Products' ? 'All' : activeCategory)
    : internalCategory;

  const handleSelectCategory = (cat) => {
    setInternalCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat === 'All' ? 'All Products' : cat);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/categories');
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products on filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('keyword', searchQuery);
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (sortOption) params.append('sort', sortOption);
        if (inStockOnly) params.append('inStockOnly', 'true');
        if (maxPriceFilter < 750) params.append('maxPrice', maxPriceFilter);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.message || 'Failed to load catalog');
        }
      } catch (err) {
        setError('Network error connecting to products API');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortOption, inStockOnly, maxPriceFilter]);

  const availableCategories = ['All', 'Audio', 'Wearables', 'Computing', 'Smart Home', 'Accessories', 'Eyewear'];

  return (
    <section id="catalog-section" className="catalog-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header-centered">
          <div className="section-pretitle">CURATED CATALOG</div>
          <h2 className="section-title">New Arrivals & Best Sellers</h2>
          <p className="section-description">
            Explore our curated selection of high-fidelity audio, wearable tech, mechanical computing, and precision design gear.
          </p>
        </div>

        {/* Filter & Category Controls */}
        <div className="catalog-controls">
          {/* Category Chips */}
          <div className="category-pills">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'All' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          {/* Right Filters */}
          <div className="filter-actions">
            {/* In Stock Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#111111' }}
              />
              <span style={{ fontWeight: 600 }}>In Stock Only</span>
            </label>

            {/* Price Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Under:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>${maxPriceFilter}</span>
              <input
                type="range"
                min="50"
                max="750"
                step="25"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                style={{ width: 85, accentColor: '#111111' }}
              />
            </div>

            {/* Sorting Select */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="select-custom"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="top-rated">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Loading Catalog...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#ef4444' }}>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products found matching your filter criteria.</p>
            <button
              onClick={() => {
                handleSelectCategory('All');
                setMaxPriceFilter(750);
                setInStockOnly(false);
              }}
              className="btn btn-outline"
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
