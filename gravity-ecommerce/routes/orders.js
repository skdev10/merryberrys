const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { protect, adminOnly } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/email');

// Create checkout session / payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    // In production, validate totalAmount by recalculating from DB prices.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalize order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentIntentId } = req.body;
    
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentIntentId,
      status: 'pending' // Order starts as pending
    });

    await order.save();
    
    // Attempt sending email (fail silently to not block API)
    sendOrderConfirmation(req.user, order).catch(err => console.log('Email failed', err));

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding order' });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

module.exports = router;
