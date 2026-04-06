import express from 'express';
import jwt from 'jsonwebtoken';
import PracticeSession from '../models/PracticeSession.js';
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

// @route   GET /api/practice/sessions
// @desc    Get user's practice sessions
// @access  Private
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;

    let query = { user: req.userId };

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sessions = await PracticeSession.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name');

    const total = await PracticeSession.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/practice/sessions
// @desc    Create a new practice session
// @access  Private
router.post('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      user: req.userId
    };

    const session = new PracticeSession(sessionData);
    await session.save();

    // Update user's practice stats
    const user = await User.findById(req.userId);
    if (user) {
      user.practiceStats.totalSessions += 1;
      user.practiceStats.totalMinutes += sessionData.duration;

      // Update streak logic (simplified)
      const today = new Date();
      const lastPractice = user.practiceStats.lastPracticeDate;

      if (!lastPractice || (today - lastPractice) > 24 * 60 * 60 * 1000) {
        user.practiceStats.currentStreak = 1;
      } else {
        user.practiceStats.currentStreak += 1;
      }

      if (user.practiceStats.currentStreak > user.practiceStats.longestStreak) {
        user.practiceStats.longestStreak = user.practiceStats.currentStreak;
      }

      user.practiceStats.lastPracticeDate = today;
      await user.save();
    }

    res.status(201).json({
      message: 'Practice session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/practice/sessions/:id
// @desc    Get a specific practice session
// @access  Private
router.get('/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const session = await PracticeSession.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Practice session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/practice/sessions/:id
// @desc    Update a practice session
// @access  Private
router.put('/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const session = await PracticeSession.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Practice session not found' });
    }

    res.json({
      message: 'Practice session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/practice/sessions/:id
// @desc    Delete a practice session
// @access  Private
router.delete('/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const session = await PracticeSession.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Practice session not found' });
    }

    res.json({ message: 'Practice session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/practice/stats
// @desc    Get practice statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await PracticeSession.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
          avgSessionDuration: { $avg: '$duration' },
          categories: {
            $push: '$category'
          }
        }
      }
    ]);

// routes/practice.js file mein


// Yeh naya route add karein
router.get('/stats', async (req, res) => {
  res.json({
    practiceStreak: 0,
    totalPracticeTime: 0,
    raagsLearned: 0
  });
});



    const categoryBreakdown = await PracticeSession.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalMinutes: { $sum: '$duration' }
        }
      }
    ]);

    res.json({
      overall: stats[0] || {
        totalSessions: 0,
        totalMinutes: 0,
        avgSessionDuration: 0
      },
      categories: categoryBreakdown
    });
  } catch (error) {
    console.error('Get practice stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;