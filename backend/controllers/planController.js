const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1 });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private (Admin only - add auth middleware later)
const createPlan = async (req, res) => {
  try {
    const { name, price, currency, duration, description, features, isPopular, cta, order } = req.body;

    // Validation
    if (!name || price === undefined || !features || features.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const plan = await Plan.create({
      name,
      price,
      currency: currency || '₹',
      duration: duration || 'month',
      description,
      features,
      isPopular: isPopular || false,
      cta,
      order: order || 0,
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private (Admin only)
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private (Admin only)
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await plan.deleteOne();
    res.json({ message: 'Plan removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Initialize default plans
// @route   POST /api/plans/init
// @access  Public (for setup only)
const initializePlans = async (req, res) => {
  try {
    // Check if plans already exist
    const existingPlans = await Plan.countDocuments();
    if (existingPlans > 0) {
      return res.status(400).json({ message: 'Plans already initialized' });
    }

    const defaultPlans = [
      {
        name: 'Free',
        price: 0,
        currency: '₹',
        duration: 'month',
        description: 'Perfect for trying out our service',
        features: [
          '5 minutes dubbing per month',
          'Basic voice quality',
          'Standard processing speed',
          'Watermark on output',
          'Email support',
        ],
        cta: 'Get Started',
        isPopular: false,
        order: 1,
      },
      {
        name: 'Pro',
        price: 999,
        currency: '₹',
        duration: 'month',
        description: 'Perfect for individual creators and small projects',
        features: [
          '60 minutes dubbing per month',
          'High-quality voice cloning',
          'Fast processing',
          'No watermark',
          'Priority support',
          'Multiple languages',
        ],
        cta: 'Start Free Trial',
        isPopular: true,
        order: 2,
      },
      {
        name: 'Enterprise',
        price: 4999,
        currency: '₹',
        duration: 'month',
        description: 'For studios and large-scale operations',
        features: [
          'Unlimited dubbing',
          'Premium voice quality',
          'Fastest processing',
          'No watermark',
          '24/7 priority support',
          'All languages',
          'API access',
          'Custom voice training',
        ],
        cta: 'Contact Sales',
        isPopular: false,
        order: 3,
      },
    ];

    const plans = await Plan.insertMany(defaultPlans);
    res.status(201).json({ message: 'Plans initialized successfully', plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  initializePlans,
};
