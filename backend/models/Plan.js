const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plan name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  currency: {
    type: String,
    default: '₹',
  },
  duration: {
    type: String,
    default: 'month',
  },
  description: {
    type: String,
    trim: true,
  },
  features: [{
    type: String,
    required: true,
  }],
  isPopular: {
    type: Boolean,
    default: false,
  },
  cta: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plan', planSchema);
