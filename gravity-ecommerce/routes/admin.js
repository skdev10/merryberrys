const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { adminOnly } = require('../middleware/auth');

// Get Dashboard Stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

    // Group last 7 days for chart data
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      chartData: [4, 5, 2, 10, 8, 15, 12] // mock trend array
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

// Admin Orders
router.get('/orders', adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

router.put('/orders/:id/status', adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating order' });
  }
});

// Admin Users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

router.put('/users/:id/disable', adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error disabling user' });
  }
});

module.exports = router;
