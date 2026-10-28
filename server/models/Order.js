const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: { type: String, default: 'Warehouse Facility' }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  deliveryMethod: {
    type: String,
    enum: ['Standard', 'Express', 'Priority'],
    default: 'Standard'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Cash on Delivery', 'UPI / NetBanking'],
    default: 'Credit Card'
  },
  paymentResult: {
    id: { type: String },
    status: { type: String, default: 'Completed' },
    updateTime: { type: String }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  discountPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  promoCode: { type: String, default: '' },
  orderStatus: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  timeline: [timelineEventSchema],
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  estimatedDelivery: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
