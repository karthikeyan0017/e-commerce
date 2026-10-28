const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';

const sampleProducts = [
  {
    name: 'AuraSound Sonic Pro ANC Headphones',
    description: 'Immerse yourself in acoustic precision. Features active noise cancellation with 8 ambient microphones, 45-hour ultra battery endurance, and spatial audio with dynamic head tracking.',
    price: 299.99,
    originalPrice: 349.99,
    category: 'Audio',
    brand: 'AuraSound',
    countInStock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    features: [
      'Hybrid Adaptive Active Noise Cancellation',
      'Custom 40mm titanium diaphragm drivers',
      '45-Hour Battery Life with USB-C Quick Charge (10 min = 5 hours)',
      'Multipoint Bluetooth 5.3 connection',
      'Memory foam plush earcups with breathable leather'
    ],
    rating: 4.9,
    numReviews: 128,
    isFeatured: true,
    isNewArrival: false
  },
  {
    name: 'Aegis Quantum Smartwatch Series 6',
    description: 'The pinnacle of wearable engineering. Aerospace-grade titanium chassis, always-on Sapphire OLED display, dual-frequency GPS, and complete bio-sensor suite.',
    price: 379.99,
    originalPrice: 429.99,
    category: 'Wearables',
    brand: 'Aegis',
    countInStock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
    ],
    features: [
      'Sapphire Crystal Always-On AMOLED Display (1000 nits)',
      'Advanced ECG, SpO2, and continuous skin temperature sensors',
      '50m Water Resistance (Swimproof & Surf ready)',
      'Up to 14 days standby battery life'
    ],
    rating: 4.8,
    numReviews: 94,
    isFeatured: true,
    isNewArrival: true
  },
  {
    name: 'Vortex Mechanical Gaming & Typing Keyboard',
    description: 'Crafted for creators and coders. CNC anodized aluminum case, hot-swappable tactile pre-lubed switches, per-key RGB backlighting, and programmable rotary knob.',
    price: 149.99,
    originalPrice: 179.99,
    category: 'Computing',
    brand: 'VortexTech',
    countInStock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ],
    features: [
      'Gasket mounted architecture with sound-dampening silicone foam',
      'Hot-swappable 5-pin mechanical switch sockets',
      'PBT double-shot shine-through keycaps',
      'Tri-mode connectivity: 2.4GHz wireless, Bluetooth 5.1, USB-C'
    ],
    rating: 4.7,
    numReviews: 83,
    isFeatured: true,
    isNewArrival: false
  },
  {
    name: 'Horizon 34-Inch Curved UltraWide Display',
    description: 'An expansive panoramic canvas with 3440x1440 WQHD resolution, 165Hz refresh rate, HDR400 color grading, and single-cable 90W USB-C power delivery.',
    price: 649.99,
    originalPrice: 729.99,
    category: 'Computing',
    brand: 'HorizonTech',
    countInStock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80'
    ],
    features: [
      '1500R immersive curvature with 99% sRGB color gamut',
      '165Hz high-refresh rate with 1ms response time',
      'Integrated KVM switch & 90W USB-C laptop dock',
      'Height, tilt, and swivel precision pneumatic stand'
    ],
    rating: 4.9,
    numReviews: 61,
    isFeatured: true,
    isNewArrival: true
  },
  {
    name: 'PulseTrack Pro GPS Fitness Band',
    description: 'Featherweight athletic companion. 24/7 heart rate variability tracking, accurate sleep architecture analysis, and multi-sport GPS mapping.',
    price: 119.99,
    originalPrice: 149.99,
    category: 'Wearables',
    brand: 'PulseTrack',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    ],
    features: [
      'Only 24 grams with breathable silicone sport loop',
      'Built-in dual-satellite GPS for phone-free workouts',
      'Continuous blood oxygen (SpO2) and stress monitoring',
      '10-day battery life with magnetic quick-snap charge'
    ],
    rating: 4.6,
    numReviews: 78,
    isFeatured: false,
    isNewArrival: true
  },
  {
    name: 'AuraSphere 360 Spatial Audio Speaker',
    description: 'Room-filling acoustic clarity encased in Scandinavian acoustic fabric and brushed aluminum. Stream high-res lossless audio effortlessly over Wi-Fi and AirPlay 2.',
    price: 199.99,
    originalPrice: 239.99,
    category: 'Audio',
    brand: 'AuraSound',
    countInStock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
    ],
    features: [
      'Omnidirectional 360-degree acoustic acoustic dispersion',
      'AirPlay 2, Spotify Connect, and Bluetooth 5.3 support',
      'Subwoofer bass radiator with zero distortion DSP',
      'Touch-sensitive capacitive volume disc with LED feedback'
    ],
    rating: 4.8,
    numReviews: 52,
    isFeatured: true,
    isNewArrival: false
  },
  {
    name: 'Lumina Atmosphere Smart Ambient Light Bar',
    description: 'Transform your desk and room environment with fluid RGBIC color gradients, reactive music rhythm synchronization, and voice assistant control.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'Smart Home',
    brand: 'Lumina',
    countInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&q=80'
    ],
    features: [
      'Over 16 million customizable dynamic color palettes',
      'Built-in ultra-sensitive acoustic sensor for music sync',
      'Compatible with Apple HomeKit, Alexa, and Google Home',
      'Anodized aluminum alloy body with desktop & monitor mounts'
    ],
    rating: 4.7,
    numReviews: 96,
    isFeatured: false,
    isNewArrival: true
  },
  {
    name: 'ErgoPoint Master Wireless Precision Mouse',
    description: 'Sculpted for hand comfort and digital productivity. Features 8000 DPI Darkfield sensor tracking on glass, electromagnetic MagSpeed scroll wheel, and whisper-quiet clicks.',
    price: 99.99,
    originalPrice: 119.99,
    category: 'Computing',
    brand: 'ErgoPoint',
    countInStock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ],
    features: [
      'MagSpeed electromagnetic wheel: scrolls 1,000 lines per second',
      'Track anywhere on any surface including optical transparent glass',
      'Multi-device flow: seamlessly copy-paste between 3 computers',
      'USB-C quick charge: 1 minute provides 3 hours of operation'
    ],
    rating: 4.9,
    numReviews: 115,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: 'Aura MagCharge 3-in-1 Fast Wireless Station',
    description: 'Power your smartphone, smartwatch, and wireless earbuds simultaneously on one sleek weighted station with certified 15W fast magnetic alignment.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Accessories',
    brand: 'AuraCharge',
    countInStock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
    ],
    features: [
      'Qi2 Certified 15W magnetic rapid charging architecture',
      'Weighted zinc-alloy pedestal ensuring one-handed phone detachment',
      'Smart temperature sensor preventing device overheating',
      'Includes 30W USB-C Power Delivery wall adapter and braided cable'
    ],
    rating: 4.8,
    numReviews: 69,
    isFeatured: false,
    isNewArrival: false
  },
  {
    name: 'Arc Gloss Polarized Sunglasses',
    description: 'Sculptural silhouette sculpted from lustrous black Italian bio-acetate with beveled browlines and premium smoke-tinted lenses. A quintessential statement frame.',
    price: 310.00,
    originalPrice: 350.00,
    category: 'Eyewear',
    brand: 'ZILO Atelier',
    countInStock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
    ],
    features: [
      'Hand-polished 8mm Italian cellulose acetate frame',
      'CR-39 scratch-resistant lenses with 100% UVA/UVB protection',
      'Custom 7-barrel German engineered barrel hinges',
      'Includes vegan leather hard case & microfiber cleaning cloth'
    ],
    rating: 4.9,
    numReviews: 87,
    isFeatured: true,
    isNewArrival: true
  },
  {
    name: 'Sona Modern II Blue-Light Eyeglasses',
    description: 'Clean Scandinavian-inspired optical prescription frame. Featherlight stainless steel rim with blue-light filtering lenses for digital screen comfort.',
    price: 285.00,
    originalPrice: 320.00,
    category: 'Eyewear',
    brand: 'ZILO Lab',
    countInStock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80'
    ],
    features: [
      'Medical-grade Swedish stainless steel frame (only 14g)',
      'Anti-reflective clear lenses with HEV blue-light shield',
      'Screwless hinge mechanism engineered for zero maintenance',
      'Prescription-ready: easily glazed by your local optician'
    ],
    rating: 4.9,
    numReviews: 92,
    isFeatured: true,
    isNewArrival: true
  },
  {
    name: 'Dusk Claw Titanium Sunglasses',
    description: 'Ultra-lightweight aerospace titanium wireframe featuring aerodynamic contouring and subtle metallic reflection. Engineered for weightless all-day optical clarity.',
    price: 335.00,
    originalPrice: 380.00,
    category: 'Eyewear',
    brand: 'ZILO Lab',
    countInStock: 9,
    imageUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
    ],
    features: [
      'Pure Japanese Beta-Titanium construction (only 16 grams)',
      'Silver flash polarized gradient lenses',
      'Hypoallergenic ceramic nose pads with micro-grip ridges',
      'Zero-glare anti-reflective back-coating'
    ],
    rating: 4.8,
    numReviews: 62,
    isFeatured: true,
    isNewArrival: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Store Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      addresses: [
        {
          street: '450 Fashion & Design Avenue, Suite 1200',
          city: 'New York',
          state: 'NY',
          zipCode: '10018',
          country: 'USA',
          isDefault: true
        }
      ]
    });

    const normalUser = await User.create({
      name: 'Elena Rostova',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 749-2041',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zipCode: '97477',
          country: 'USA',
          isDefault: true
        }
      ]
    });

    console.log(`Created Admin: ${adminUser.email} (Password: admin123)`);
    console.log(`Created Customer: ${normalUser.email} (Password: user123)`);

    // 2. Seed Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${createdProducts.length} full-catalog products across Audio, Wearables, Computing, Smart Home, Accessories, and Eyewear.`);

    // 3. Seed Sample Orders with realistic tracking timelines
    const order1 = await Order.create({
      user: normalUser._id,
      orderNumber: 'ORD-894125',
      orderItems: [
        {
          product: createdProducts[0]._id, // AuraSound Sonic Pro ANC Headphones
          name: createdProducts[0].name,
          image: createdProducts[0].imageUrl,
          price: createdProducts[0].price,
          qty: 1
        },
        {
          product: createdProducts[9]._id, // Arc Gloss Sunglasses
          name: createdProducts[9].name,
          image: createdProducts[9].imageUrl,
          price: createdProducts[9].price,
          qty: 1
        }
      ],
      shippingAddress: {
        fullName: 'Elena Rostova',
        email: 'user@example.com',
        phone: '+1 (555) 749-2041',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      paymentResult: {
        id: 'PAY-ORD-894125',
        status: 'Completed',
        updateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      itemsPrice: 609.99,
      discountPrice: 91.50, // 15% off with code ZILO15
      promoCode: 'ZILO15',
      taxPrice: 41.48,
      shippingPrice: 0.00,
      totalPrice: 559.97,
      orderStatus: 'Shipped',
      timeline: [
        {
          status: 'Order Placed',
          description: 'Order confirmed and verified in fulfillment center.',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          location: 'New York Fulfillment Hub'
        },
        {
          status: 'Processing',
          description: 'Quality inspection, serial verification, and packaging completed.',
          timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000),
          location: 'Brooklyn Operations Center, NY'
        },
        {
          status: 'Shipped',
          description: 'Handed over to carrier FedEx Express. En route to regional distribution center.',
          timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
          location: 'Portland Sorting Facility, OR'
        }
      ],
      isPaid: true,
      paidAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      isDelivered: false,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const order2 = await Order.create({
      user: normalUser._id,
      orderNumber: 'ORD-762914',
      orderItems: [
        {
          product: createdProducts[1]._id, // Aegis Quantum Smartwatch Series 6
          name: createdProducts[1].name,
          image: createdProducts[1].imageUrl,
          price: createdProducts[1].price,
          qty: 1
        }
      ],
      shippingAddress: {
        fullName: 'Elena Rostova',
        email: 'user@example.com',
        phone: '+1 (555) 749-2041',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      paymentResult: {
        id: 'PAY-ORD-762914',
        status: 'Completed',
        updateTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      itemsPrice: 379.99,
      discountPrice: 38.00,
      promoCode: 'SAVE10',
      taxPrice: 27.36,
      shippingPrice: 0.00,
      totalPrice: 369.35,
      orderStatus: 'Delivered',
      timeline: [
        {
          status: 'Order Placed',
          description: 'Order placed and authenticated.',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          location: 'New York Fulfillment Hub'
        },
        {
          status: 'Processing',
          description: 'Device serial recorded and package sealed.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          location: 'New York Hub'
        },
        {
          status: 'Shipped',
          description: 'Carrier picked up consignment.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          location: 'Newark Distribution Center, NJ'
        },
        {
          status: 'Out for Delivery',
          description: 'Consignment placed on courier van for morning delivery.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          location: 'Springfield, OR'
        },
        {
          status: 'Delivered',
          description: 'Package delivered directly with signature confirmation.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          location: 'Springfield, OR'
        }
      ],
      isPaid: true,
      paidAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    console.log(`Created 2 sample orders: ${order1.orderNumber} (Shipped) & ${order2.orderNumber} (Delivered)`);
    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err) {
    console.error('Error during database seed:', err);
    process.exit(1);
  }
};

seedDB();
