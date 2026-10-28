# ZILO OPTICS — Full-Stack Trendy Eyewear E-Commerce & Order Tracking Platform

> **Template Inspiration:** Inspired by the [Wix Eyewear Store (Trendy) / Zilo Optics Template](https://www.wix.com/website-template/view/html/wh-1420), rebuilt as a high-performance full-stack e-commerce platform.

A modern, editorial full-stack optical & eyewear e-commerce web application featuring handcrafted acetate and titanium frames, real-time product management, dynamic shopping bag drawer, multi-step checkout with coupon validation (`ZILO15`), live visual order tracking, and role-based access control (Admin/Customer).

---

## 🌟 Key Features & Sections

### 👓 Editorial Eyewear Discovery & Layout
- **Top Announcement Bar**: Displays international shipping offers and promo code `ZILO15`.
- **Editorial Hero Section**: *"Frame Your Perspective"* with dual CTAs for *Sunglasses* and *Eyeglasses*.
- **4-Pillars Guarantee Strip**: Lifetime Frame Guarantee, Italian Bio-Acetate, Zero-Glare Optics, and 30-Day Home Trial.
- **Select Your Style (Split Banners)**: Dedicated lifestyle portals for *The SUN Collection* and *Precision Optical Frames*.
- **Curated New Arrivals**: Filterable gallery featuring authentic models (`Arc Gloss`, `Dusk Claw Silver`, `Vela Wrap`, `Sona Modern II`, `Kepler Classic`, `Zova Sculpt`).
- **Built for Everyday Wear**: 3-pillar craftsmanship feature highlighting sustainable cellulose acetate and Japanese CR-39 glass.
- **Elevate Your Look Promo Voucher**: Instant 15% discount coupon (`ZILO15`).
- **Join the Inner Circle**: VIP newsletter subscription form.
- **Quick View Optical Modal**: High-res gallery, optical specifications table (Lens width, Bridge, Temple, Weight), and color finish swatches.

### 🛍️ Shopping Bag & Checkout Experience
- **Slide-Out Glassmorphic Bag Drawer**: Real-time quantity adjustments and item removal.
- **Voucher & Promo Code Engine**:
  - `ZILO15`: 15% off first frame order
  - `SAVE10`: 10% off total order
  - `FREESHIP`: 100% discount on transit delivery
  - `SUPER25`: $25 instant voucher
- **Multi-Step Checkout Flow**:
  1. *Destination*: Recipient address and contact details (auto-filled for logged-in users).
  2. *Transit Speed*: Standard (Free over $150), Express ($9.99), or Priority Overnight ($19.99).
  3. *Payment*: Interactive virtual card mockup with live preview and validation, Cash on Delivery (COD), or UPI.
  4. *Order Review*: Detailed financial calculation (Subtotal, Vouchers, Tax, Shipping, Total).
  5. *Order Confirmation*: Instant order creation with unique Tracking ID (e.g., `ORD-894125`).

### 🚚 Real-Time Order Tracking
- **Public & Authenticated Tracking**: Search any order by Order Number from anywhere in the app.
- **Visual Status Stepper**: 5-stage progress indicator:
  `Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`
- **Granular Timeline History**: Timestamped checkpoints showing facility locations and carrier transit updates.
- **Try Sample Orders**:
  - `ORD-894125`: Active in-transit order (`Shipped` status with FedEx Express Optics)
  - `ORD-762914`: Completed order (`Delivered` status with DHL Luxury Courier)

### 🔐 User Authentication & Role-Based Access
- **1-Click Quick Demo Buttons**: Instant login buttons in the navigation bar:
  - 👤 **Demo Customer**: `user@example.com` / `user123`
  - 🛡️ **Demo Admin**: `admin@example.com` / `admin123`

### 📊 Admin Control Center
- **Key Metrics Overview**: Real-time Total Revenue, Orders Count, Catalog Size, and Registered Users.
- **Product Management (CRUD)**: Create, edit, and delete eyewear models with custom categories (`Sunglasses`, `Eyeglasses`, `The SUN Collection`, `Italian Bio-Acetate`, `Minimalist Titanium`).
- **Order Logistics Management**: Real-time status updater (`Processing`, `Shipped`, `Out for Delivery`, `Delivered`). Updating status automatically appends a new tracking event with timestamps into the live database.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Vanilla CSS Editorial Design System, Lucide Icons |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB with Mongoose ODM (Port 27017) |
| **Authentication** | JSON Web Tokens (JWT) & BcryptJS |
| **Typography** | Montserrat & Plus Jakarta Sans |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
npm run install:all
```

### 2. Seed Database
Populate 12 authentic Zilo Optics frames and sample orders with active tracking timelines:
```bash
npm run seed
```

### 3. Run Full Application
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API & Server**: `http://localhost:5000`
