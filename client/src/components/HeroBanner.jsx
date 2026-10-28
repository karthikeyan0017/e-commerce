import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const HeroBanner = ({ onExplore, onTrack, onCategorySelect }) => {
  return (
    <div>
      {/* HERO — Full-Bleed (Wix Eyewear Trendy Template Style) */}
      <section className="hero-fullbleed">
        <img
          className="hero-fullbleed-img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=85"
          alt="Curated Tech & Lifestyle Collection"
        />
        <div className="hero-fullbleed-overlay" />
        <div className="hero-fullbleed-content">
          <div className="hero-eyebrow">
            Curated Collection · 2026
          </div>
          <h1 className="hero-main-title">
            Design Your<br />Perspective
          </h1>
          <p className="hero-subtitle">
            Where minimalist industrial aesthetics meet uncompromising engineering.
            Acoustic precision, biometric wearables, tactile computing, and architectural eyewear.
          </p>
          <div className="hero-cta-group">
            <button
              onClick={() => onCategorySelect ? onCategorySelect('All Products') : onExplore()}
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '0.85rem' }}
            >
              Shop Collection <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onCategorySelect ? onCategorySelect('Audio') : onExplore()}
              className="btn btn-outline-white"
              style={{ padding: '1rem 2rem', fontSize: '0.85rem' }}
            >
              Featured Audio
            </button>
          </div>
        </div>
      </section>

      {/* Feature Strip — 4 Pillars */}
      <section className="feature-strip">
        <div className="container">
          <div className="feature-strip-grid">
            <div className="feature-strip-item">
              <div className="feature-strip-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="feature-strip-title">Lifetime Craft Guarantee</div>
                <div className="feature-strip-sub">Certified warranty and free hardware repairs</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="feature-strip-title">Sustainable Materials</div>
                <div className="feature-strip-sub">Recycled aerospace alloys and bio-materials</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon">
                <Layers size={20} />
              </div>
              <div>
                <div className="feature-strip-title">Precision Performance</div>
                <div className="feature-strip-sub">Engineered to elevate your daily routine</div>
              </div>
            </div>
            <div className="feature-strip-item">
              <div className="feature-strip-icon">
                <RefreshCw size={20} />
              </div>
              <div>
                <div className="feature-strip-title">30-Day Home Trial</div>
                <div className="feature-strip-sub">Complimentary global returns & exchanges</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
