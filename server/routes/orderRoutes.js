const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

// Helper to generate human-readable order number
const generateOrderNumber = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${randomDigits}`;
};

// @route   POST /api/orders
// @desc    Create new order & decrement stock
// @access  Public (Optional Auth)
router.post('/', optionalProtect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountPrice,
      taxPrice,
      totalPrice,
      promoCode
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Incomplete shipping address' });
    }

    // Verify stock availability and decrement
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} available.`
        });
      }
      // Decrement stock
      product.countInStock = Math.max(0, product.countInStock - item.qty);
      await product.save();
    }

    const orderNumber = generateOrderNumber();

    // Calculate estimated delivery
    const estDate = new Date();
    if (deliveryMethod === 'Priority') {
      estDate.setDate(estDate.getDate() + 2);
    } else if (deliveryMethod === 'Express') {
      estDate.setDate(estDate.getDate() + 4);
    } else {
      estDate.setDate(estDate.getDate() + 7);
    }

    const initialTimeline = [
      {
        status: 'Order Placed',
        description: `Order successfully placed via ${paymentMethod || 'Credit Card'}. Confirmation receipt sent to ${shippingAddress.email}.`,
        timestamp: new Date(),
        location: 'Online Checkout Hub'
      }
    ];

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : null,
      orderItems,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'Standard',
      paymentMethod: paymentMethod || 'Credit Card',
      paymentResult: {
        id: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'Completed',
        updateTime: new Date().toISOString()
      },
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      discountPrice: Number(discountPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      promoCode: promoCode || '',
      orderStatus: 'Order Placed',
      timeline: initialTimeline,
      isPaid: paymentMethod !== 'Cash on Delivery',
      paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
      estimatedDelivery: estDate
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating order' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving your orders' });
  }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Track order by orderNumber or ID (Public)
// @access  Public
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const query = req.params.orderNumber.startsWith('ORD-')
      ? { orderNumber: req.params.orderNumber }
      : {
          $or: [
            { orderNumber: req.params.orderNumber },
            ...(req.params.orderNumber.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.params.orderNumber }] : [])
          ]
        };

    const order = await Order.findOne(query).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${req.params.orderNumber} not found. Please verify the order number and try again.`
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving order tracking details' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership or admin
    if (req.user.role !== 'admin' && (!order.user || order.user._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status & append tracking timeline (Admin only)
// @access  Private/Admin
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, description, location } = req.body;
    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;

    // Default descriptions based on status
    const defaultDescriptions = {
      'Processing': 'Items gathered and packaged at central fulfillment center.',
      'Shipped': 'Parcel picked up by carrier transit service. Tracking in motion.',
      'Out for Delivery': 'Carrier delivery agent is en route to customer destination address.',
      'Delivered': 'Package safely delivered and signed at destination address.',
      'Cancelled': 'Order has been cancelled upon request.'
    };

    const newTimelineEvent = {
      status,
      description: description || defaultDescriptions[status] || `Order status updated to ${status}.`,
      timestamp: new Date(),
      location: location || (status === 'Delivered' ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'Logistics Hub')
    };

    order.timeline.push(newTimelineEvent);

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating order status' });
  }
});

module.exports = router;
