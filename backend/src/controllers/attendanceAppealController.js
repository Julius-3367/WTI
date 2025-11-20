const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * CANDIDATE: Submit attendance appeal
 * POST /api/candidate/attendance/:attendanceId/appeal
 */
const submitAppeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attendanceId } = req.params;
    const { reason, requestedStatus, supportingDocuments } = req.body;

    // Get candidate profile
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true, tenantId: true },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

    // Get attendance record and verify ownership
    const attendanceRecord = await prisma.attendanceRecord.findUnique({
      where: { id: parseInt(attendanceId) },
      include: {
        enrollment: {
          select: { candidateId: true },
        },
      },
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    if (attendanceRecord.enrollment.candidateId !== candidate.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only appeal your own attendance records',
      });
    }

    // Check if appeal already exists
    const existingAppeal = await prisma.attendanceAppeal.findFirst({
      where: {
        attendanceRecordId: parseInt(attendanceId),
        candidateId: candidate.id,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (existingAppeal) {
      return res.status(400).json({
        success: false,
        message: 'An active appeal already exists for this attendance record',
      });
    }

    // Validate reason
    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed reason (minimum 10 characters)',
      });
    }

    // Create appeal
    const appeal = await prisma.attendanceAppeal.create({
      data: {
        tenantId: candidate.tenantId,
        attendanceRecordId: parseInt(attendanceId),
        candidateId: candidate.id,
        reason: reason.trim(),
        originalStatus: attendanceRecord.status,
        requestedStatus: requestedStatus || null,
        supportingDocuments: supportingDocuments ? JSON.stringify(supportingDocuments) : null,
        status: 'PENDING',
      },
      include: {
        attendanceRecord: {
          include: {
            course: {
              select: { id: true, title: true, code: true },
            },
          },
        },
      },
    });

    // TODO: Send notification to trainer/admin

    res.status(201).json({
      success: true,
      message: 'Appeal submitted successfully',
      data: appeal,
    });
  } catch (error) {
    console.error('Error submitting appeal:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting appeal',
      error: error.message,
    });
  }
};

/**
 * CANDIDATE: Get my appeals
 * GET /api/candidate/attendance/appeals
 */
const getMyAppeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, courseId } = req.query;

    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true, tenantId: true },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

    const whereClause = {
      candidateId: candidate.id,
      tenantId: candidate.tenantId,
    };

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (courseId) {
      whereClause.attendanceRecord = {
        courseId: parseInt(courseId),
      };
    }

    const appeals = await prisma.attendanceAppeal.findMany({
      where: whereClause,
      include: {
        attendanceRecord: {
          include: {
            course: {
              select: { id: true, title: true, code: true },
            },
          },
        },
        reviewer: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: appeals,
    });
  } catch (error) {
    console.error('Error fetching appeals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appeals',
      error: error.message,
    });
  }
};

/**
 * CANDIDATE: Cancel pending appeal
 * DELETE /api/candidate/attendance/appeals/:appealId
 */
const cancelAppeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appealId } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found',
      });
    }

    const appeal = await prisma.attendanceAppeal.findUnique({
      where: { id: parseInt(appealId) },
    });

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found',
      });
    }

    if (appeal.candidateId !== candidate.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appeals',
      });
    }

    if (appeal.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only pending appeals can be cancelled',
      });
    }

    const updated = await prisma.attendanceAppeal.update({
      where: { id: parseInt(appealId) },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      message: 'Appeal cancelled successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error cancelling appeal:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appeal',
      error: error.message,
    });
  }
};

/**
 * TRAINER: Get appeals for my courses
 * GET /api/trainer/attendance/appeals
 */
const getTrainerAppeals = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { status, courseId } = req.query;

    // Get user's tenant
    const user = await prisma.user.findUnique({
      where: { id: trainerId },
      select: { tenantId: true },
    });

    if (!user || !user.tenantId) {
      return res.status(400).json({
        success: false,
        message: 'User tenant not found',
      });
    }

    // Get trainer's courses
    const courses = await prisma.course.findMany({
      where: {
        tenantId: user.tenantId,
        trainers: {
          has: trainerId,
        },
      },
      select: { id: true },
    });

    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const whereClause = {
      tenantId: user.tenantId,
      attendanceRecord: {
        courseId: { in: courseId ? [parseInt(courseId)] : courseIds },
      },
    };

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const appeals = await prisma.attendanceAppeal.findMany({
      where: whereClause,
      include: {
        attendanceRecord: {
          include: {
            course: {
              select: { id: true, title: true, code: true },
            },
            enrollment: {
              include: {
                candidate: {
                  select: {
                    id: true,
                    fullName: true,
                    user: {
                      select: { email: true },
                    },
                  },
                },
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: { email: true, firstName: true, lastName: true },
            },
          },
        },
        reviewer: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: appeals,
    });
  } catch (error) {
    console.error('Error fetching trainer appeals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appeals',
      error: error.message,
    });
  }
};

/**
 * TRAINER: Review appeal (approve/reject)
 * PUT /api/trainer/attendance/appeals/:appealId/review
 */
const reviewAppeal = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { appealId } = req.params;
    const { action, comments, newStatus } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be APPROVED or REJECTED',
      });
    }

    const appeal = await prisma.attendanceAppeal.findUnique({
      where: { id: parseInt(appealId) },
      include: {
        attendanceRecord: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found',
      });
    }

    // Verify trainer teaches this course
    if (!appeal.attendanceRecord.course.trainers || 
        !appeal.attendanceRecord.course.trainers.includes(trainerId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only review appeals for your courses',
      });
    }

    if (appeal.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only pending appeals can be reviewed',
      });
    }

    // Update appeal status
    const updatedAppeal = await prisma.attendanceAppeal.update({
      where: { id: parseInt(appealId) },
      data: {
        status: action,
        reviewedBy: trainerId,
        reviewedAt: new Date(),
        reviewerComments: comments || null,
      },
      include: {
        attendanceRecord: {
          include: {
            course: true,
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    // If approved, update attendance record
    if (action === 'APPROVED') {
      const statusToSet = newStatus || appeal.requestedStatus || 'EXCUSED';
      
      await prisma.attendanceRecord.update({
        where: { id: appeal.attendanceRecordId },
        data: {
          status: statusToSet,
          remarks: `Appeal approved by trainer. Previous status: ${appeal.originalStatus}. ${comments ? 'Comments: ' + comments : ''}`,
        },
      });
    }

    // TODO: Send notification to candidate

    res.json({
      success: true,
      message: `Appeal ${action.toLowerCase()} successfully`,
      data: updatedAppeal,
    });
  } catch (error) {
    console.error('Error reviewing appeal:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing appeal',
      error: error.message,
    });
  }
};

/**
 * ADMIN: Get all appeals (system-wide)
 * GET /api/admin/attendance/appeals
 */
const getAdminAppeals = async (req, res) => {
  try {
    const { status, courseId, candidateId, startDate, endDate } = req.query;

    // Get user's tenant
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { tenantId: true },
    });

    if (!user || !user.tenantId) {
      return res.status(400).json({
        success: false,
        message: 'User tenant not found',
      });
    }

    const whereClause = {
      tenantId: user.tenantId,
    };

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (courseId) {
      whereClause.attendanceRecord = {
        courseId: parseInt(courseId),
      };
    }

    if (candidateId) {
      whereClause.candidateId = parseInt(candidateId);
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    const appeals = await prisma.attendanceAppeal.findMany({
      where: whereClause,
      include: {
        attendanceRecord: {
          include: {
            course: {
              select: { id: true, title: true, code: true },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: { email: true, firstName: true, lastName: true },
            },
          },
        },
        reviewer: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Calculate statistics
    const stats = {
      total: appeals.length,
      pending: appeals.filter(a => a.status === 'PENDING').length,
      approved: appeals.filter(a => a.status === 'APPROVED').length,
      rejected: appeals.filter(a => a.status === 'REJECTED').length,
      cancelled: appeals.filter(a => a.status === 'CANCELLED').length,
    };

    res.json({
      success: true,
      data: {
        appeals,
        statistics: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching admin appeals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appeals',
      error: error.message,
    });
  }
};

/**
 * ADMIN: Override appeal decision
 * PUT /api/admin/attendance/appeals/:appealId/override
 */
const overrideAppeal = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { appealId } = req.params;
    const { action, comments, newStatus } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be APPROVED or REJECTED',
      });
    }

    const appeal = await prisma.attendanceAppeal.findUnique({
      where: { id: parseInt(appealId) },
      include: {
        attendanceRecord: {
          include: {
            course: true,
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found',
      });
    }

    // Admin can override any status
    const updatedAppeal = await prisma.attendanceAppeal.update({
      where: { id: parseInt(appealId) },
      data: {
        status: action,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        reviewerComments: `[ADMIN OVERRIDE] ${comments || 'No comments provided'}`,
      },
      include: {
        attendanceRecord: {
          include: {
            course: true,
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    // If approved, update attendance record
    if (action === 'APPROVED') {
      const statusToSet = newStatus || appeal.requestedStatus || 'EXCUSED';
      
      await prisma.attendanceRecord.update({
        where: { id: appeal.attendanceRecordId },
        data: {
          status: statusToSet,
          remarks: `Appeal approved by admin (override). Previous status: ${appeal.originalStatus}. ${comments || ''}`,
        },
      });
    }

    // TODO: Send notification to candidate and trainer

    res.json({
      success: true,
      message: `Appeal ${action.toLowerCase()} successfully (admin override)`,
      data: updatedAppeal,
    });
  } catch (error) {
    console.error('Error overriding appeal:', error);
    res.status(500).json({
      success: false,
      message: 'Error overriding appeal',
      error: error.message,
    });
  }
};

module.exports = {
  // Candidate
  submitAppeal,
  getMyAppeals,
  cancelAppeal,
  
  // Trainer
  getTrainerAppeals,
  reviewAppeal,
  
  // Admin
  getAdminAppeals,
  overrideAppeal,
};
