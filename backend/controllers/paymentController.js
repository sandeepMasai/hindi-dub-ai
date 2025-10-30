const Payment = require('../models/Payment');
const User = require('../models/User');
const razorpay = require('../config/razorpay');

// Generate unique transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `TXN${timestamp}${random}`;
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
      return res.status(400).json({ message: 'Amount and plan name are required' });
    }

    // Calculate total with tax
    const tax = amount * 0.18; // 18% GST
    const totalAmount = Math.round((amount + tax) * 100); // Convert to paise

    const options = {
      amount: totalAmount, // amount in paise
      currency: 'INR',
      receipt: generateTransactionId(),
      notes: {
        planName,
        userId: req.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_3Lxr4QmUc9qlvY',
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      amount,
      personalDetails,
    } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is verified
      const tax = amount * 0.18;
      const totalAmount = amount + tax;

      const paymentData = {
        user: req.user.id,
        planName,
        amount,
        tax,
        totalAmount,
        paymentMethod: 'razorpay',
        transactionId: razorpay_payment_id,
        paymentStatus: 'completed',
        personalDetails,
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
        },
      };

      const payment = await Payment.create(paymentData);

      // Update user's plan
      await User.findByIdAndUpdate(req.user.id, {
        currentPlan: planName,
        planExpiryDate: calculateExpiryDate(planName),
      });

      res.json({
        message: 'Payment verified successfully',
        payment: {
          transactionId: payment.transactionId,
          amount: payment.totalAmount,
          status: payment.paymentStatus,
          planName: payment.planName,
        },
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
const processPayment = async (req, res) => {
  try {
    const {
      planName,
      amount,
      paymentMethod,
      personalDetails,
      paymentDetails,
    } = req.body;

    // Validate required fields
    if (!planName || amount === undefined || !paymentMethod || !personalDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate tax and total
    const tax = amount * 0.18; // 18% GST
    const totalAmount = amount + tax;

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Prepare payment data
    const paymentData = {
      user: req.user.id,
      planName,
      amount,
      tax,
      totalAmount,
      paymentMethod,
      transactionId,
      personalDetails,
      paymentDetails: {},
    };

    // Process based on payment method
    if (paymentMethod === 'card') {
      // In production, integrate with payment gateway (Stripe, Razorpay, etc.)
      // For now, simulate card payment processing
      
      if (!paymentDetails.cardNumber || !paymentDetails.cardName) {
        return res.status(400).json({ message: 'Invalid card details' });
      }

      // Store only last 4 digits (never store full card number in production)
      const cardLastFour = paymentDetails.cardNumber.slice(-4);
      const cardBrand = detectCardBrand(paymentDetails.cardNumber);

      paymentData.paymentDetails = {
        cardLastFour,
        cardBrand,
      };

      // Simulate payment processing
      const paymentSuccess = await simulateCardPayment(paymentDetails);
      
      if (!paymentSuccess) {
        paymentData.paymentStatus = 'failed';
        paymentData.errorMessage = 'Card payment declined';
        
        const failedPayment = await Payment.create(paymentData);
        
        return res.status(400).json({
          message: 'Payment failed. Please check your card details.',
          transactionId: failedPayment.transactionId,
        });
      }

    } else if (paymentMethod === 'upi') {
      // Simulate UPI payment processing
      
      if (!paymentDetails.upiId) {
        return res.status(400).json({ message: 'Invalid UPI ID' });
      }

      paymentData.paymentDetails = {
        upiId: paymentDetails.upiId,
      };

      // Simulate UPI payment
      const paymentSuccess = await simulateUpiPayment(paymentDetails.upiId);
      
      if (!paymentSuccess) {
        paymentData.paymentStatus = 'failed';
        paymentData.errorMessage = 'UPI payment failed';
        
        const failedPayment = await Payment.create(paymentData);
        
        return res.status(400).json({
          message: 'UPI payment failed. Please try again.',
          transactionId: failedPayment.transactionId,
        });
      }
    }

    // Payment successful
    paymentData.paymentStatus = 'completed';
    const payment = await Payment.create(paymentData);

    // Update user's plan
    await User.findByIdAndUpdate(req.user.id, {
      currentPlan: planName,
      planExpiryDate: calculateExpiryDate(planName),
    });

    res.status(201).json({
      message: 'Payment successful',
      payment: {
        transactionId: payment.transactionId,
        amount: payment.totalAmount,
        status: payment.paymentStatus,
        planName: payment.planName,
      },
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-paymentDetails.cardNumber -paymentDetails.cvv');

    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payment by transaction ID
// @route   GET /api/payments/:transactionId
// @access  Private
const getPaymentByTransaction = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      user: req.user.id,
    }).select('-paymentDetails.cardNumber -paymentDetails.cvv');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Detect card brand
const detectCardBrand = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';
  if (/^35/.test(number)) return 'JCB';
  if (/^(6304|6706|6709|6771)/.test(number)) return 'RuPay';
  
  return 'Unknown';
};

// Helper: Simulate card payment (replace with real payment gateway)
const simulateCardPayment = async (cardDetails) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, integrate with:
  // - Stripe
  // - Razorpay
  // - PayU
  // - Paytm
  
  // For demo, accept all valid-looking cards
  const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
  return cardNumber.length === 16;
};

// Helper: Simulate UPI payment (replace with real UPI gateway)
const simulateUpiPayment = async (upiId) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In production, integrate with:
  // - Razorpay UPI
  // - PayU UPI
  // - PhonePe
  // - Google Pay API
  
  // For demo, accept all valid-looking UPI IDs
  return upiId.includes('@');
};

// Helper: Calculate plan expiry date
const calculateExpiryDate = (planName) => {
  const now = new Date();
  
  if (planName === 'Free') {
    return null; // Free plan doesn't expire
  } else if (planName === 'Basic' || planName === 'Pro') {
    // Monthly plans
    return new Date(now.setMonth(now.getMonth() + 1));
  } else if (planName === 'Enterprise') {
    // Yearly plan
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
  
  return null;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayment,
  getPaymentHistory,
  getPaymentByTransaction,
};
