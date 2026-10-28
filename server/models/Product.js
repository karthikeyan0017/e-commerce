const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    trim: true
  },
  brand: {
    type: String,
    default: 'AuraTech'
  },
  countInStock: {
    type: Number,
    required: [true, 'Please enter product stock count'],
    min: 0,
    default: 0
  },
  imageUrl: {
    type: String,
    required: [true, 'Please enter primary image URL']
  },
  additionalImages: [String],
  features: [String],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Full-text search index on name, description, category, brand
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
