const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', authenticate, authorize(['ADMIN']), adminController.getAllUsers);

module.exports = router;
