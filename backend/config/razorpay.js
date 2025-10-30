const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_3Lxr4QmUc9qlvY',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '', // Add your key secret in .env
});

module.exports = razorpayInstance;
