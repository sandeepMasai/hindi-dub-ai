const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayment,
  getPaymentHistory,
  getPaymentByTransaction,
} = require('../controllers/paymentController');

// Razorpay Routes
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

// Legacy Routes (for card/UPI simulation)
router.post('/process', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/:transactionId', protect, getPaymentByTransaction);

module.exports = router;
