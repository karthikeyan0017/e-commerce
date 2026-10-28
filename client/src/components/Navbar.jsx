import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  Moon,
  Sun,
  Truck,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  onOpenAuthModal,
  onSelectCategory
}) => {
  const { user, isAdmin, logout, quickLogin } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('auracommerce_theme', nextTheme);
  };

  const handleNav = (view, category = null) => {
    setActiveView(view);
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar (Trendy Template Style) */}
      <div className="announcement-bar">
        <span>COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER $150</span>
        <span className="announcement-pill">CODE: SAVE10 OR ZILO15</span>
      </div>

      {/* Main Navbar */}
      <header className="navbar-header">
        <div className="container">
          <div className="navbar-inner">
            {/* Left: Navigation Links */}
            <nav className="nav-left hide-on-mobile">
              <button
                className={`nav-link-btn ${activeView === 'shop' ? 'active' : ''}`}
                onClick={() => handleNav('shop', 'All')}
              >
                Collection
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNav('shop', 'Audio')}
              >
                Audio
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNav('shop', 'Wearables')}
              >
                Wearables
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNav('shop', 'Computing')}
              >
                Computing
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNav('shop', 'Smart Home')}
              >
                Smart Home
              </button>
              <button
                className="nav-link-btn"
                onClick={() => handleNav('shop', 'Eyewear')}
              >
                Eyewear
              </button>
              <button
                className={`nav-link-btn ${activeView === 'track' ? 'active' : ''}`}
                onClick={() => handleNav('track')}
              >
                Track Order
              </button>
              {user && (
                <button
                  className={`nav-link-btn ${activeView === 'my-orders' ? 'active' : ''}`}
                  onClick={() => handleNav('my-orders')}
                >
                  My Orders
                </button>
              )}
              {isAdmin && (
                <button
                  className={`nav-link-btn ${activeView === 'admin' ? 'active' : ''}`}
                  style={{ color: 'var(--accent-taupe)', fontWeight: 700 }}
                  onClick={() => handleNav('admin')}
                >
                  Admin
                </button>
              )}
            </nav>

            {/* Center: Brand Logo */}
            <div
              className="brand-logo"
              onClick={() => handleNav('shop', 'All')}
              title="AURA ATELIER — Homepage"
            >
              <span className="brand-logo-title">AURA ATELIER</span>
              <span className="brand-logo-sub">CURATED TECH & LIFESTYLE</span>
            </div>

            {/* Right: Nav Actions */}
            <div className="nav-actions">
              {/* Search bar */}
              <div style={{ position: 'relative', minWidth: 160, maxWidth: 220 }} className="hide-on-mobile">
                <Search
                  size={15}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.1rem',
                    paddingRight: searchQuery ? '2rem' : '0.8rem',
                    paddingTop: '0.45rem',
                    paddingBottom: '0.45rem',
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {!user && (
                <div style={{ display: 'flex', gap: '0.35rem' }} className="hide-on-mobile">
                  <button
                    onClick={() => quickLogin('user')}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.68rem',
                      letterSpacing: '0.08em',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                    title="1-Click Demo Customer Account"
                  >
                    Demo User
                  </button>
                  <button
                    onClick={() => quickLogin('admin')}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.68rem',
                      letterSpacing: '0.08em',
                      backgroundColor: '#111111',
                      border: '1px solid #111111',
                      color: '#ffffff'
                    }}
                    title="1-Click Demo Store Admin"
                  >
                    Demo Admin
                  </button>
                </div>
              )}

              <button
                onClick={toggleTheme}
                className="btn-icon"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}
                  >
                    <User size={15} color="var(--accent-bronze)" />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={13} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '115%',
                        minWidth: 200,
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-xs)',
                        boxShadow: 'var(--shadow-xl)',
                        padding: '0.5rem',
                        zIndex: 100
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        {isAdmin && (
                          <span className="badge badge-dark" style={{ marginTop: '0.4rem', fontSize: '0.62rem' }}>
                            Store Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleNav('my-orders')}
                        className="footer-link-item"
                        style={{ width: '100%', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}
                      >
                        <PackageCheck size={14} /> My Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNav('admin')}
                          className="footer-link-item"
                          style={{ width: '100%', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-bronze)' }}
                        >
                          <ShieldCheck size={14} /> Admin Portal
                        </button>
                      )}
                      <button
                        onClick={logout}
                        className="footer-link-item"
                        style={{ width: '100%', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem' }}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="btn btn-outline"
                  style={{ padding: '0.48rem 1rem', fontSize: '0.75rem' }}
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-icon"
                style={{ position: 'relative', backgroundColor: 'var(--bg-secondary)' }}
                aria-label="View shopping bag"
              >
                <ShoppingBag size={18} />
                {totalItemsCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      width: 19,
                      height: 19,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--bg-surface)'
                    }}
                  >
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-icon show-on-mobile"
                style={{ display: 'none' }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <button
              onClick={() => handleNav('shop', 'All')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              All Products
            </button>
            <button
              onClick={() => handleNav('shop', 'Audio')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Audio
            </button>
            <button
              onClick={() => handleNav('shop', 'Wearables')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Wearables
            </button>
            <button
              onClick={() => handleNav('shop', 'Computing')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Computing
            </button>
            <button
              onClick={() => handleNav('shop', 'Smart Home')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Smart Home
            </button>
            <button
              onClick={() => handleNav('shop', 'Eyewear')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Eyewear
            </button>
            <button
              onClick={() => handleNav('track')}
              className="nav-link-btn"
              style={{ textAlign: 'left' }}
            >
              Track Order
            </button>
            {user && (
              <button
                onClick={() => handleNav('my-orders')}
                className="nav-link-btn"
                style={{ textAlign: 'left' }}
              >
                My Orders
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="nav-link-btn"
                style={{ textAlign: 'left', color: 'var(--accent-bronze)' }}
              >
                Admin Dashboard
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
