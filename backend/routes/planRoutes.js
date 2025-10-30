const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  initializePlans,
} = require('../controllers/planController');

// Public routes
router.get('/', getPlans);
router.get('/:id', getPlan);

// Initialize default plans (run once)
router.post('/init', initializePlans);

// Admin routes (add auth middleware later)
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;
