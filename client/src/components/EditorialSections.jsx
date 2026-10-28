import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles, Layers, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EditorialSections = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the Inner Circle! 15% promo code sent to your inbox.', 'success');
  };

  return (
    <>
      {/* 1. SELECT YOUR DOMAIN (Split Category Cards from Wix Template) */}
      <section className="style-selector-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="section-pretitle">EXPLORE BY CATEGORY</div>
            <h2 className="section-title">Select Your Domain</h2>
            <p className="section-description">
              Curated gear engineered to transform how you listen, create, track, and experience everyday life.
            </p>
          </div>

          <div className="style-grid-cards">
            {/* Audio & Wearables Card */}
            <div
              className="style-card"
              onClick={() => onSelectCategory('Audio')}
            >
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&q=80"
                alt="Audio & Wearables Collection"
              />
              <div className="style-card-overlay">
                <span className="style-card-subtitle">ACOUSTIC & BIOMETRIC</span>
                <h3 className="style-card-title">Audio & Wearables</h3>
                <p className="style-card-desc">
                  Immersive spatial audio headsets, wireless studio pods, and titanium smartwatches built for active clarity.
                </p>
                <div>
                  <button className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.76rem' }}>
                    Shop Audio & Wearables <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Workspace & Lifestyle Card */}
            <div
              className="style-card"
              onClick={() => onSelectCategory('Computing')}
            >
              <img
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=80"
                alt="Workspace & Lifestyle Gear"
              />
              <div className="style-card-overlay">
                <span className="style-card-subtitle">WORKSPACE & LIFESTYLE</span>
                <h3 className="style-card-title">Computing & Home</h3>
                <p className="style-card-desc">
                  Curved ultrawide displays, tactile mechanical keyboards, reactive ambient lighting, and precision eyewear.
                </p>
                <div>
                  <button className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.76rem' }}>
                    Shop Workspace Gear <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BUILT FOR EVERYDAY PERFORMANCE (Craftsmanship from Wix Template) */}
      <section className="craftsmanship-section">
        <div className="container">
          <div className="section-header-centered" style={{ color: '#ffffff' }}>
            <div className="section-pretitle" style={{ color: 'var(--accent-bronze)' }}>
              ENGINEERING PHILOSOPHY
            </div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              Built for Everyday Performance
            </h2>
            <p className="section-description" style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              Every product in our collection undergoes rigorous laboratory stress testing. From CNC anodized aluminum to precision optical glass, each element is crafted for durability.
            </p>
          </div>

          <div className="craftsmanship-grid">
            <div className="craftsmanship-card">
              <div className="craftsmanship-number">01</div>
              <h3 className="craftsmanship-title">Engineered Durability</h3>
              <p className="craftsmanship-desc">
                Aircraft-grade titanium, CNC milled aluminum, and reinforced bio-polymers ensure long-term resilience against daily wear and heavy multi-device usage.
              </p>
            </div>

            <div className="craftsmanship-card">
              <div className="craftsmanship-number">02</div>
              <h3 className="craftsmanship-title">Acoustic & Optical Precision</h3>
              <p className="craftsmanship-desc">
                Custom 40mm titanium diaphragm drivers, Japanese CR-39 scratch-resistant lenses, and calibrated sensors deliver certified high-fidelity performance.
              </p>
            </div>

            <div className="craftsmanship-card">
              <div className="craftsmanship-number">03</div>
              <h3 className="craftsmanship-title">30-Day Hassle-Free Trial</h3>
              <p className="craftsmanship-desc">
                Experience products in your real setup with complete peace of mind. Complimentary return shipping and instant exchanges on all domestic and international orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ELEVATE YOUR LOOK & SETUP (Promo Banner from Wix Template) */}
      <section className="promo-banner-section">
        <div className="container">
          <div className="promo-banner-content">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-bronze)', fontWeight: 700 }}>
              EXCLUSIVE INVITATION
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0.85rem 0' }}>
              Elevate Your Setup
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: 580, margin: '0 auto' }}>
              Enjoy fifteen percent off your next order across all categories. Apply voucher code at checkout for immediate savings.
            </p>

            <div className="voucher-badge-code">
              <span>VOUCHER CODE:</span>
              <strong style={{ letterSpacing: '0.25em' }}>ZILO15</strong>
            </div>

            <div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Also valid with code <strong style={{ color: '#ffffff' }}>SAVE10</strong> for 10% off and <strong style={{ color: '#ffffff' }}>FREESHIP</strong> for complimentary delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. JOIN THE INNER CIRCLE (VIP Newsletter) */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <div className="section-pretitle">PRIVATE MEMBERSHIP</div>
            <h2 className="section-title">Join the Inner Circle</h2>
            <p className="section-description">
              Be the first to access limited-run product drops, exclusive founder previews, and private seasonal releases.
            </p>

            {subscribed ? (
              <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <Check size={20} color="#16a34a" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  You are now enrolled in the Inner Circle. Check your inbox for your 15% discount voucher!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
