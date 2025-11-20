const prisma = require('../config/database');

/**
 * Get all support tickets
 */
const getTickets = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            tenantId: req.user.tenantId,
        };

        // If candidate, only show their tickets
        if (req.user.role.name === 'Candidate') {
            where.userId = req.user.id;
        }

        if (status) {
            where.status = status.toUpperCase();
        }

        if (category) {
            where.category = category;
        }

        const [tickets, total] = await Promise.all([
            prisma.supportTicket.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    assignedToUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    comments: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            user: {
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
            prisma.supportTicket.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                tickets,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets',
            error: error.message,
        });
    }
};

/**
 * Get ticket by ID
 */
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignedToUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Check access: candidate can only view their own tickets
        if (req.user.role.name === 'Candidate' && ticket.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket',
            error: error.message,
        });
    }
};

/**
 * Create a support ticket
 */
const createTicket = async (req, res) => {
    try {
        const { subject, description, category = 'General', priority = 'MEDIUM' } = req.body;

        if (!subject || !description) {
            return res.status(400).json({
                success: false,
                message: 'Subject and description are required',
            });
        }

        // Generate ticket number
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const ticketNumber = `TKT-${timestamp}-${random}`;

        const ticket = await prisma.supportTicket.create({
            data: {
                tenantId: req.user.tenantId,
                userId: req.user.id,
                ticketNumber,
                subject,
                description,
                category,
                priority: priority.toUpperCase(),
                status: 'OPEN',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        // Notify admins about new ticket
        const admins = await prisma.user.findMany({
            where: {
                tenantId: req.user.tenantId,
                role: {
                    name: 'Admin',
                },
            },
            select: { id: true },
        });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    tenantId: req.user.tenantId,
                    userId: admin.id,
                    channel: 'IN_APP',
                    templateKey: 'NEW_SUPPORT_TICKET',
                    payload: {
                        ticketId: ticket.id,
                        ticketNumber: ticket.ticketNumber,
                        subject: ticket.subject,
                        userName: `${req.user.firstName} ${req.user.lastName}`,
                    },
                    status: 'QUEUED',
                },
            });
        }

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create ticket',
            error: error.message,
        });
    }
};

/**
 * Update ticket (admin only)
 */
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, assignedTo, resolution } = req.body;

        const updateData = {};

        if (status) updateData.status = status.toUpperCase();
        if (priority) updateData.priority = priority.toUpperCase();
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo ? parseInt(assignedTo) : null;
        if (resolution) {
            updateData.resolution = resolution;
            if (status === 'RESOLVED' || status === 'CLOSED') {
                updateData.resolvedAt = new Date();
            }
        }

        const ticket = await prisma.supportTicket.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignedToUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Ticket updated successfully',
            data: ticket,
        });
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update ticket',
            error: error.message,
        });
    }
};

/**
 * Add comment to ticket
 */
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, isInternal = false } = req.body;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: 'Comment is required',
            });
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: parseInt(id) },
            select: { userId: true },
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        // Candidates cannot add internal comments
        const isInternalComment = req.user.role.name !== 'Candidate' && isInternal;

        const ticketComment = await prisma.supportTicketComment.create({
            data: {
                ticketId: parseInt(id),
                userId: req.user.id,
                comment,
                isInternal: isInternalComment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Notify ticket creator about new comment (unless they added it)
        if (ticket.userId !== req.user.id && !isInternalComment) {
            await prisma.notification.create({
                data: {
                    tenantId: req.user.tenantId,
                    userId: ticket.userId,
                    channel: 'IN_APP',
                    templateKey: 'TICKET_COMMENT',
                    payload: {
                        ticketId: parseInt(id),
                        commentBy: `${req.user.firstName} ${req.user.lastName}`,
                    },
                    status: 'QUEUED',
                },
            });
        }

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: ticketComment,
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message,
        });
    }
};

/**
 * Get ticket statistics (admin only)
 */
const getStatistics = async (req, res) => {
    try {
        const [total, open, inProgress, resolved, closed, byCategory, byPriority] = await Promise.all([
            prisma.supportTicket.count({
                where: { tenantId: req.user.tenantId },
            }),
            prisma.supportTicket.count({
                where: { tenantId: req.user.tenantId, status: 'OPEN' },
            }),
            prisma.supportTicket.count({
                where: { tenantId: req.user.tenantId, status: 'IN_PROGRESS' },
            }),
            prisma.supportTicket.count({
                where: { tenantId: req.user.tenantId, status: 'RESOLVED' },
            }),
            prisma.supportTicket.count({
                where: { tenantId: req.user.tenantId, status: 'CLOSED' },
            }),
            prisma.supportTicket.groupBy({
                by: ['category'],
                where: { tenantId: req.user.tenantId },
                _count: true,
            }),
            prisma.supportTicket.groupBy({
                by: ['priority'],
                where: { tenantId: req.user.tenantId },
                _count: true,
            }),
        ]);

        res.json({
            success: true,
            data: {
                total,
                open,
                inProgress,
                resolved,
                closed,
                byCategory,
                byPriority,
            },
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message,
        });
    }
};

module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    addComment,
    getStatistics,
};
