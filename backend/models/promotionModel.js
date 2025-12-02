const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  discount: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

promotionSchema.index({ business: 1, isActive: 1, expiryDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
