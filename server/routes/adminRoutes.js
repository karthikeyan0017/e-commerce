const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics, revenue, counts, low stock alerts, and recent activities
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Aggregate total revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Status breakdown
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Low stock items (stock <= 5)
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
      .select('name price countInStock category imageUrl')
      .limit(6);

    // Recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving admin statistics' });
  }
});

module.exports = router;
