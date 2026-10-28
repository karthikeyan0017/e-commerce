const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products/categories
// @desc    Get all distinct categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving categories' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving featured products' });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering, searching, and sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, inStockOnly, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Keyword search (name or description or brand)
    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { brand: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock availability
    if (inStockOnly === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (sort === 'name') sortOptions = { name: 1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error retrieving products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid product ID' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      brand,
      countInStock,
      imageUrl,
      additionalImages,
      features,
      isFeatured,
      isNewArrival
    } = req.body;

    if (!name || price === undefined || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and image URL are required'
      });
    }

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      description: description || 'Premium product with state-of-the-art craftsmanship and modern design.',
      category,
      brand: brand || 'AuraTech',
      countInStock: countInStock !== undefined ? Number(countInStock) : 10,
      imageUrl,
      additionalImages: additionalImages || [],
      features: features || [],
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = [
      'name', 'price', 'originalPrice', 'description', 'category', 'brand',
      'countInStock', 'imageUrl', 'additionalImages', 'features', 'isFeatured', 'isNewArrival'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error adding review' });
  }
});

module.exports = router;
