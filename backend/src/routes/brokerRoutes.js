const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and Broker role
router.use(authenticate);
router.use(authorize(['Broker', 'Admin']));

/**
 * Dashboard
 */
router.get('/dashboard', brokerController.getDashboard);

/**
 * Referrals (Candidate Management)
 */
router.get('/referrals', brokerController.getReferrals);
router.post('/referrals', brokerController.createReferral);

/**
 * Placements
 */
router.get('/placements', brokerController.getPlacements);

/**
 * Commissions
 */
router.get('/commissions', brokerController.getCommissions);

/**
 * Payments
 */
router.get('/payments', brokerController.getPayments);

module.exports = router;
