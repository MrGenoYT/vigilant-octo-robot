const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bot = require('../models/Bot');
const ForumPost = require('../models/ForumPost');
const adminAuth = require('../middleware/adminAuth');
const { isAdmin, isAuthenticated } = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Report = require('../models/Report');

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    // Find user
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json(await User.findById(req.params.id).select('-password'));
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bots (admin only)
router.get('/bots', adminAuth, async (req, res) => {
  try {
    const bots = await Bot.find().populate('owner', 'username');
    res.json(bots);
  } catch (err) {
    console.error('Error fetching bots:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bot (admin only)
router.delete('/bots/:id', adminAuth, async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    await Bot.findByIdAndDelete(req.params.id);

    res.json({ message: 'Bot deleted successfully' });
  } catch (err) {
    console.error('Error deleting bot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get site statistics (admin only)
router.get('/statistics', adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const botCount = await Bot.countDocuments();
    const forumPostCount = await ForumPost.countDocuments();

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const botsByStatus = await Bot.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const forumPostsByCategory = await ForumPost.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    const newBotsThisMonth = await Bot.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    res.json({
      totalUsers: userCount,
      totalBots: botCount,
      totalForumPosts: forumPostCount,
      usersByRole,
      botsByStatus,
      forumPostsByCategory,
      newUsersThisMonth,
      newBotsThisMonth
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all reported content
router.get('/reported-content', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('reportedBy', 'username email')
      .populate('contentId');

    const totalReports = await Report.countDocuments({ status: 'pending' });
    const totalPages = Math.ceil(totalReports / limit);

    res.json({
      reports,
      currentPage: page,
      totalPages,
      totalReports
    });
  } catch (err) {
    console.error('Error fetching reported content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a report (mark as valid)
router.put('/reported-content/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'approved';
    report.reviewedBy = req.user.id;
    report.reviewedAt = Date.now();
    await report.save();

    res.json({ message: 'Report approved successfully', report });
  } catch (err) {
    console.error('Error approving report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dismiss a report (mark as invalid)
router.put('/reported-content/:id/dismiss', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'dismissed';
    report.reviewedBy = req.user.id;
    report.reviewedAt = Date.now();
    await report.save();

    res.json({ message: 'Report dismissed successfully', report });
  } catch (err) {
    console.error('Error dismissing report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reported content
router.delete('/reported-content/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const report = await Report.findOne({ contentId: req.params.id });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete the content based on the content type
    if (report.contentType === 'post') {
      await Post.findByIdAndDelete(report.contentId);
    } else if (report.contentType === 'comment') {
      await Comment.findByIdAndDelete(report.contentId);
    } else if (report.contentType === 'user') {
      // Handle user reports differently - maybe flag the account or notify superadmin
      const reportedUser = await User.findById(report.contentId);
      reportedUser.isFlagged = true;
      await reportedUser.save();
    }

    // Update all reports related to this content
    await Report.updateMany(
      { contentId: req.params.id },
      { 
        status: 'resolved', 
        reviewedBy: req.user.id,
        reviewedAt: Date.now()
      }
    );

    res.json({ message: 'Content deleted and reports resolved' });
  } catch (err) {
    console.error('Error deleting reported content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin dashboard stats
router.get('/dashboard-stats', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const newPostsToday = await Post.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({
      userCount,
      postCount,
      pendingReports,
      newUsersToday,
      newPostsToday
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router
module.exports = router;