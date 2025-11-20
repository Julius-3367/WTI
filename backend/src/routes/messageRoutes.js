const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * Message Routes
 */
router.get('/', messageController.getMessages);
router.get('/unread-count', messageController.getUnreadCount);
router.post('/', messageController.sendMessage);
router.patch('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
