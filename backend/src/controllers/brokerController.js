const prisma = require('../config/database');

/**
 * Resolve tenant ID from broker user
 */
const resolveTenantId = async (user) => {
  if (user.tenantId) return user.tenantId;
  
  const userTenant = await prisma.userTenant.findFirst({
    where: { userId: user.id },
    select: { tenantId: true },
  });
  
  return userTenant?.tenantId || null;
};

/**
 * Get broker dashboard overview
 */
const getDashboard = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    // Find the broker record associated with this user
    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ 
        success: false, 
        message: 'Broker profile not found. Please contact admin.' 
      });
    }

    // Get statistics
    const [
      totalReferrals,
      activePlacements,
      completedPlacements,
      totalCommissionEarned,
      pendingCommission,
      recentCandidates,
      recentPlacements,
      monthlyStats
    ] = await Promise.all([
      // Total candidates referred by this broker
      prisma.candidate.count({
        where: { 
          tenantId,
          brokerId: broker.id 
        },
      }),
      
      // Active placements (not completed or cancelled)
      prisma.placement.count({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: {
            notIn: ['COMPLETED', 'CANCELLED']
          }
        },
      }),
      
      // Completed placements
      prisma.placement.count({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: 'COMPLETED'
        },
      }),
      
      // Total commission from completed placements
      prisma.placement.aggregate({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: 'COMPLETED'
        },
        _sum: {
          brokerFee: true
        }
      }),
      
      // Pending commission (placements in progress)
      prisma.placement.aggregate({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: {
            notIn: ['COMPLETED', 'CANCELLED']
          }
        },
        _sum: {
          brokerFee: true
        }
      }),
      
      // Recent candidates (last 5)
      prisma.candidate.findMany({
        where: {
          tenantId,
          brokerId: broker.id
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          fullName: true,
          status: true,
          createdAt: true,
          preferredCountry: true,
          jobTypePreference: true
        }
      }),
      
      // Recent placements
      prisma.placement.findMany({
        where: {
          tenantId,
          brokerId: broker.id
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          candidate: {
            select: {
              id: true,
              fullName: true
            }
          },
          jobOpening: {
            select: {
              jobTitle: true,
              employerName: true,
              location: true
            }
          }
        }
      }),
      
      // Monthly referral statistics (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(createdAt, '%Y-%m') as month,
          COUNT(*) as count
        FROM candidates
        WHERE tenantId = ${tenantId} 
          AND brokerId = ${broker.id}
          AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
      `
    ]);

    res.json({
      success: true,
      data: {
        broker: {
          id: broker.id,
          name: broker.name,
          brokerCode: broker.brokerCode,
          commissionType: broker.commissionType,
          commissionAmount: broker.commissionAmount
        },
        stats: {
          totalReferrals,
          activePlacements,
          completedPlacements,
          totalCommissionEarned: totalCommissionEarned._sum.brokerFee || 0,
          pendingCommission: pendingCommission._sum.brokerFee || 0
        },
        recentCandidates,
        recentPlacements,
        monthlyStats: monthlyStats.map(stat => ({
          month: stat.month,
          referrals: Number(stat.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get broker dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load dashboard',
      error: error.message 
    });
  }
};

/**
 * Get all referrals (candidates) by this broker
 */
const getReferrals = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker profile not found' });
    }

    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      tenantId,
      brokerId: broker.id
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { nationalIdPassport: { contains: search } }
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          fullName: true,
          gender: true,
          nationalIdPassport: true,
          status: true,
          preferredCountry: true,
          jobTypePreference: true,
          createdAt: true,
          updatedAt: true,
          placements: {
            select: {
              id: true,
              placementStatus: true,
              brokerFee: true
            }
          }
        }
      }),
      prisma.candidate.count({ where })
    ]);

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load referrals',
      error: error.message 
    });
  }
};

/**
 * Submit new candidate referral
 */
const createReferral = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker profile not found' });
    }

    const {
      fullName,
      gender,
      dob,
      nationalIdPassport,
      county,
      maritalStatus,
      highestEducation,
      languages,
      relevantSkills,
      preferredCountry,
      jobTypePreference,
      email,
      phoneNumber
    } = req.body;

    // Validate required fields
    if (!fullName || !nationalIdPassport) {
      return res.status(400).json({
        success: false,
        message: 'Full name and ID/Passport are required'
      });
    }

    // Check for duplicate ID/Passport
    const existing = await prisma.candidate.findFirst({
      where: {
        tenantId,
        nationalIdPassport
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this ID/Passport already exists'
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        tenantId,
        brokerId: broker.id,
        fullName,
        gender,
        dob: dob ? new Date(dob) : null,
        nationalIdPassport,
        county,
        maritalStatus,
        highestEducation,
        languages,
        relevantSkills,
        preferredCountry,
        jobTypePreference,
        email,
        phoneNumber,
        status: 'PENDING_VETTING'
      }
    });

    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Referral submitted successfully'
    });
  } catch (error) {
    console.error('Create referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit referral',
      error: error.message
    });
  }
};

/**
 * Get placements for broker's referred candidates
 */
const getPlacements = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker profile not found' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      tenantId,
      brokerId: broker.id
    };

    if (status) {
      where.placementStatus = status;
    }

    const [placements, total] = await Promise.all([
      prisma.placement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          candidate: {
            select: {
              id: true,
              fullName: true,
              nationalIdPassport: true
            }
          },
          jobOpening: {
            select: {
              id: true,
              jobTitle: true,
              employerName: true,
              location: true,
              salaryRange: true
            }
          }
        }
      }),
      prisma.placement.count({ where })
    ]);

    res.json({
      success: true,
      data: placements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get placements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load placements',
      error: error.message
    });
  }
};

/**
 * Get commission breakdown
 */
const getCommissions = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker profile not found' });
    }

    // Get commission summary
    const [earned, pending, byStatus] = await Promise.all([
      // Total earned (completed placements)
      prisma.placement.aggregate({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: 'COMPLETED'
        },
        _sum: { brokerFee: true },
        _count: true
      }),
      
      // Pending (in-progress placements)
      prisma.placement.aggregate({
        where: {
          tenantId,
          brokerId: broker.id,
          placementStatus: {
            notIn: ['COMPLETED', 'CANCELLED']
          }
        },
        _sum: { brokerFee: true },
        _count: true
      }),
      
      // Breakdown by placement status
      prisma.placement.groupBy({
        by: ['placementStatus'],
        where: {
          tenantId,
          brokerId: broker.id
        },
        _sum: {
          brokerFee: true
        },
        _count: true
      })
    ]);

    // Get detailed commission records
    const placements = await prisma.placement.findMany({
      where: {
        tenantId,
        brokerId: broker.id,
        brokerFee: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true
          }
        },
        jobOpening: {
          select: {
            jobTitle: true,
            employerName: true,
            location: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalEarned: earned._sum.brokerFee || 0,
          earnedCount: earned._count,
          totalPending: pending._sum.brokerFee || 0,
          pendingCount: pending._count,
          byStatus: byStatus.map(item => ({
            status: item.placementStatus,
            amount: item._sum.brokerFee || 0,
            count: item._count
          }))
        },
        commissions: placements.map(p => ({
          id: p.id,
          candidate: p.candidate,
          jobOpening: p.jobOpening,
          status: p.placementStatus,
          brokerFee: p.brokerFee,
          placementDate: p.createdAt,
          completionDate: p.placementCompletedDate
        }))
      }
    });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load commissions',
      error: error.message
    });
  }
};

/**
 * Get payment history
 */
const getPayments = async (req, res) => {
  try {
    const tenantId = await resolveTenantId(req.user);
    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'Missing tenant context' });
    }

    const broker = await prisma.broker.findFirst({
      where: { 
        tenantId,
        createdBy: req.user.id 
      },
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker profile not found' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      tenantId,
      brokerId: broker.id
    };

    if (status) {
      where.paymentStatus = status;
    }

    const [payments, total, summary] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          placement: {
            include: {
              candidate: {
                select: {
                  fullName: true
                }
              }
            }
          }
        }
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({
        where,
        _sum: { amount: true },
        _count: true
      })
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalPayments: summary._count
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load payments',
      error: error.message
    });
  }
};

module.exports = {
  getDashboard,
  getReferrals,
  createReferral,
  getPlacements,
  getCommissions,
  getPayments
};
