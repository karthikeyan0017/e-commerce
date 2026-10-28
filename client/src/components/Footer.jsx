import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Eye, ArrowUpRight } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        {/* Main 4-Column Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ffffff' }}>
                AURA
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-bronze)', fontWeight: 800 }}>•</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(255, 255, 255, 0.6)' }}>
                ATELIER
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-bronze)', marginBottom: '1.25rem' }}>
              CURATED TECH & LIFESTYLE
            </div>
            <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7, maxWidth: 320, marginBottom: '1.5rem' }}>
              Where minimalist industrial engineering meets uncompromising craftsmanship. Curated audio, wearables, mechanical computing, and precision design accessories.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.82rem' }}>
              <span>New York</span> • <span>London</span> • <span>Tokyo</span> • <span>Berlin</span>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="footer-col-title">Collections</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  High-Fidelity Audio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Biometric Smart Wearables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Computing & Mechanical Gear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Smart Home & Atmosphere
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Designer Eyewear & Optics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div>
            <h4 className="footer-col-title">Client Services</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => onNavigate('track')} className="footer-link-item">
                  Track Active Consignment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Device Compatibility Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Lifetime Hardware Warranty
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Complimentary 30-Day Home Trial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="footer-link-item">
                  Global Shipping & Delivery Times
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Store Locations */}
          <div>
            <h4 className="footer-col-title">Concierge & Support</h4>
            <ul className="footer-links">
              <li style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.86rem' }}>
                Email: concierge@aura-atelier.com
              </li>
              <li style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.86rem' }}>
                Tel: +1 (555) 019-AURA
              </li>
              <li style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.86rem' }}>
                Hours: Mon – Sat, 9:00 AM – 8:00 PM EST
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <span className="announcement-pill" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--accent-bronze)', border: '1px solid var(--accent-bronze)' }}>
                  Active Coupon: SAVE10 (10% OFF)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} AURA ATELIER COMMERCE INC. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
            <span>Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
