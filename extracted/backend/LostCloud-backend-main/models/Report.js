
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  contentType: {
    type: String,
    required: true,
    enum: ['post', 'comment', 'user', 'bot']
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'contentType'
  },
  contentPreview: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'dismissed', 'resolved'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
});

// Add indexes for better performance
ReportSchema.index({ contentType: 1, contentId: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ reportedAt: -1 });

module.exports = mongoose.model('Report', 'reports');
