const prisma = require('../config/database');

/**
 * Get all messages for a user (inbox and sent)
 */
const getMessages = async (req, res) => {
    try {
        const { type = 'inbox', page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            tenantId: req.user.tenantId,
        };

        if (type === 'inbox') {
            where.recipientId = req.user.id;
        } else if (type === 'sent') {
            where.senderId = req.user.id;
        }

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    recipient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.message.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                messages,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message,
        });
    }
};

/**
 * Get unread message count
 */
const getUnreadCount = async (req, res) => {
    try {
        const count = await prisma.message.count({
            where: {
                tenantId: req.user.tenantId,
                recipientId: req.user.id,
                isRead: false,
            },
        });

        res.json({
            success: true,
            data: { unreadCount: count },
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count',
            error: error.message,
        });
    }
};

/**
 * Send a message
 */
const sendMessage = async (req, res) => {
    try {
        const { recipientId, subject, message, parentId, attachments } = req.body;

        if (!recipientId || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Recipient, subject, and message are required',
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                tenantId: req.user.tenantId,
                senderId: req.user.id,
                recipientId: parseInt(recipientId),
                subject,
                message,
                parentId: parentId ? parseInt(parentId) : null,
                attachments: attachments || null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        // Create notification for recipient
        await prisma.notification.create({
            data: {
                tenantId: req.user.tenantId,
                userId: parseInt(recipientId),
                channel: 'IN_APP',
                templateKey: 'NEW_MESSAGE',
                payload: {
                    messageId: newMessage.id,
                    senderName: `${req.user.firstName} ${req.user.lastName}`,
                    subject: subject,
                },
                status: 'QUEUED',
            },
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage,
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message,
        });
    }
};

/**
 * Mark message as read
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await prisma.message.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        res.json({
            success: true,
            message: 'Message marked as read',
            data: message,
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read',
            error: error.message,
        });
    }
};

/**
 * Delete a message
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.message.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.json({
            success: true,
            message: 'Message deleted successfully',
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message,
        });
    }
};

module.exports = {
    getMessages,
    getUnreadCount,
    sendMessage,
    markAsRead,
    deleteMessage,
};
