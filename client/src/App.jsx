import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { EditorialSections } from './components/EditorialSections';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { UserOrdersView } from './components/UserOrdersView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

function MainApp() {
  const [activeView, setActiveView] = useState('shop'); // 'shop' | 'track' | 'my-orders' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('auracommerce_theme') || 'light';
  });

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [trackOrderNumber, setTrackOrderNumber] = useState('');

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleOrderPlaced = (newOrderNumber) => {
    setTrackOrderNumber(newOrderNumber);
    setActiveView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackDirect = (orderNum) => {
    setTrackOrderNumber(orderNum);
    setActiveView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setActiveView('shop');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Editorial Luxury Header & Announcement Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        setTheme={setTheme}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'shop' && (
          <>
            {/* Zilo Optics Hero Banner */}
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onTrack={() => {
                setActiveView('track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCategorySelect={handleCategorySelect}
            />

            {/* Curated New Arrivals Optical Catalog */}
            <ProductCatalog
              searchQuery={searchQuery}
              onQuickView={(product) => setQuickViewProduct(product)}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Editorial Sections: Select Your Style, Built for Everyday Wear, Elevate Your Look 15% Voucher, Join Inner Circle */}
            <EditorialSections
              onSelectCategory={handleCategorySelect}
            />
          </>
        )}

        {activeView === 'track' && (
          <OrderTrackingView
            initialOrderNumber={trackOrderNumber || 'ORD-894125'}
          />
        )}

        {activeView === 'my-orders' && (
          <UserOrdersView
            onTrackOrder={handleTrackDirect}
            onShop={() => {
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Interactive Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Multi-step Checkout Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Product Quick View / Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Store Footer */}
      <Footer onNavigate={(view) => {
        setActiveView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
