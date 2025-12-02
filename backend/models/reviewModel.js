const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  },
  images: [{
    type: String
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1, business: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);
