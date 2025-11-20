const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * Support Ticket Routes
 */
router.get('/', supportTicketController.getTickets);
router.get('/statistics', authorize(['Admin']), supportTicketController.getStatistics);
router.get('/:id', supportTicketController.getTicketById);
router.post('/', supportTicketController.createTicket);
router.put('/:id', authorize(['Admin']), supportTicketController.updateTicket);
router.post('/:id/comments', supportTicketController.addComment);

module.exports = router;
