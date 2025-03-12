const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');

// Get reported content with pagination
router.get('/reported-content', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status: 'pending' })
      .sort({ reportedAt: -1 })
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

// Get all users with pagination (admin only)
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? { 
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ] 
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
      totalUsers
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system logs
router.get('/logs', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // This would typically be implemented with a logging system
    // For now, return a placeholder
    res.json({
      logs: [
        { timestamp: new Date(), level: 'info', message: 'System started' },
        { timestamp: new Date(), level: 'warn', message: 'High memory usage detected' }
      ]
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;