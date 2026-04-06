import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// @route   GET /api/subscription/status
// @desc    Get user's subscription status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscription subscriptionExpiry');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isActive = user.subscription !== 'free' &&
      (!user.subscriptionExpiry || user.subscriptionExpiry > new Date());

    res.json({
      subscription: user.subscription,
      expiry: user.subscriptionExpiry,
      isActive
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/subscription/upgrade
// @desc    Upgrade user subscription
// @access  Private
router.post('/upgrade', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body; // 'premium' or 'pro'

    if (!['premium', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    // In a real app, this would integrate with Stripe/PayPal
    // For now, we'll simulate the upgrade
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        subscription: plan,
        subscriptionExpiry: expiryDate
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `Subscription upgraded to ${plan}`,
      subscription: user.subscription,
      expiry: user.subscriptionExpiry
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/subscription/cancel
// @desc    Cancel user subscription
// @access  Private
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        subscription: 'free',
        subscriptionExpiry: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/subscription/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Basic riyaz guides',
        'Limited raag library access',
        'Community forum access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      features: [
        'All riyaz guides',
        'Full raag library',
        'Practice tracking',
        'AI Guru basic access',
        'Progress analytics'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      features: [
        'Everything in Premium',
        'Advanced AI Guru features',
        'Personal practice plans',
        'Audio recording analysis',
        'Priority support',
        'Offline access'
      ]
    }
  ];

  res.json({ plans });
});

// Stripe webhook endpoint (for future implementation)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Handle Stripe webhooks here
  res.json({ received: true });
});

export default router;