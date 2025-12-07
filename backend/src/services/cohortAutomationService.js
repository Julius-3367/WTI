const prisma = require('../config/database');

/**
 * Cohort Automation Service
 * Handles all automated workflows for cohorts and enrollments
 */

class CohortAutomationService {
  /**
   * Check if cohort can accept new enrollments
   */
  async canEnroll(cohortId) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      select: {
        status: true,
        maxCapacity: true,
        currentEnrollment: true,
        enrollmentDeadline: true,
      },
    });

    if (!cohort) {
      throw new Error('Cohort not found');
    }

    // Check status
    const validStatuses = ['ENROLLMENT_OPEN', 'PUBLISHED'];
    if (!validStatuses.includes(cohort.status)) {
      return { canEnroll: false, reason: 'Cohort is not accepting enrollments' };
    }

    // Check capacity
    if (cohort.currentEnrollment >= cohort.maxCapacity) {
      return { canEnroll: false, reason: 'Cohort is full' };
    }

    // Check deadline
    if (new Date() > new Date(cohort.enrollmentDeadline)) {
      return { canEnroll: false, reason: 'Enrollment deadline has passed' };
    }

    return { canEnroll: true };
  }

  /**
   * Increment cohort enrollment count
   */
  async incrementEnrollmentCount(cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        currentEnrollment: {
          increment: 1,
        },
      },
    });

    // Check if cohort is now full and auto-close if needed
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      select: { currentEnrollment: true, maxCapacity: true, status: true },
    });

    if (cohort.currentEnrollment >= cohort.maxCapacity && cohort.status === 'ENROLLMENT_OPEN') {
      await this.closeCohortEnrollment(cohortId, 'Capacity reached');
    }
  }

  /**
   * Decrement cohort enrollment count
   */
  async decrementEnrollmentCount(cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        currentEnrollment: {
          decrement: 1,
        },
      },
    });
  }

  /**
   * Synchronize enrollment statuses between CohortEnrollment and Enrollment
   */
  async syncEnrollmentStatus(cohortEnrollmentId) {
    const cohortEnrollment = await prisma.cohortEnrollment.findUnique({
      where: { id: cohortEnrollmentId },
      include: {
        enrollment: true,
      },
    });

    if (!cohortEnrollment || !cohortEnrollment.enrollmentId) {
      return; // No main enrollment to sync
    }

    // Map cohort enrollment status to enrollment status
    const statusMap = {
      ENROLLED: 'ENROLLED',
      COMPLETED: 'COMPLETED',
      WITHDRAWN: 'WITHDRAWN',
      REJECTED: 'REJECTED',
    };

    const enrollmentStatus = statusMap[cohortEnrollment.status];
    if (!enrollmentStatus) {
      return; // No mapping needed
    }

    // Update main enrollment if needed
    if (cohortEnrollment.enrollment.enrollmentStatus !== enrollmentStatus) {
      await prisma.enrollment.update({
        where: { id: cohortEnrollment.enrollmentId },
        data: {
          enrollmentStatus,
        },
      });
    }
  }

  /**
   * Close cohort enrollment
   */
  async closeCohortEnrollment(cohortId, reason = 'Auto-closed') {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        status: 'ENROLLMENT_CLOSED',
      },
    });

    console.log(`Cohort ${cohortId} enrollment closed: ${reason}`);
  }

  /**
   * Start cohort training
   */
  async startCohortTraining(cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        status: 'IN_TRAINING',
      },
    });

    console.log(`Cohort ${cohortId} training started`);
  }

  /**
   * Complete cohort
   */
  async completeCohort(cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        status: 'COMPLETED',
      },
    });

    // Auto-update all enrolled students to completed
    await prisma.cohortEnrollment.updateMany({
      where: {
        cohortId,
        status: 'ENROLLED',
      },
      data: {
        status: 'COMPLETED',
      },
    });

    console.log(`Cohort ${cohortId} completed`);
  }

  /**
   * Calculate and update cohort metrics
   */
  async updateCohortMetrics(cohortId) {
    // Get all enrollments for this cohort
    const enrollments = await prisma.cohortEnrollment.findMany({
      where: {
        cohortId,
        status: 'ENROLLED',
      },
      select: {
        attendanceRate: true,
        assessmentsPassed: true,
        assessmentsFailed: true,
        vettingStatus: true,
        placementReady: true,
      },
    });

    if (enrollments.length === 0) {
      return;
    }

    // Calculate averages
    const totalAttendance = enrollments.reduce((sum, e) => sum + e.attendanceRate, 0);
    const avgAttendance = totalAttendance / enrollments.length;

    const totalAssessments = enrollments.reduce(
      (sum, e) => sum + e.assessmentsPassed + e.assessmentsFailed,
      0
    );
    const totalPassed = enrollments.reduce((sum, e) => sum + e.assessmentsPassed, 0);
    const avgAssessment = totalAssessments > 0 ? (totalPassed / totalAssessments) * 100 : 0;

    const vettingCleared = enrollments.filter((e) => e.vettingStatus === 'CLEARED').length;
    const vettingRate = (vettingCleared / enrollments.length) * 100;

    const placementReady = enrollments.filter((e) => e.placementReady).length;

    // Update cohort
    await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        attendanceRate: avgAttendance,
        assessmentAverage: avgAssessment,
        vettingCompletionRate: vettingRate,
        placementReadyCount: placementReady,
      },
    });
  }

  /**
   * Auto-issue certificate if criteria met
   */
  async checkAndIssueCertificate(cohortEnrollmentId) {
    const enrollment = await prisma.cohortEnrollment.findUnique({
      where: { id: cohortEnrollmentId },
      include: {
        cohort: {
          include: {
            course: true,
          },
        },
        candidate: true,
        enrollment: true,
      },
    });

    if (!enrollment) return;

    // Check criteria
    const criteria = {
      statusCompleted: enrollment.status === 'COMPLETED',
      attendanceMet: enrollment.attendanceRate >= 80,
      assessmentsPassed: enrollment.assessmentsPassed > 0 && enrollment.assessmentsFailed === 0,
      vettingCleared: enrollment.vettingStatus === 'CLEARED',
      notYetIssued: !enrollment.certificationIssued,
    };

    const allCriteriaMet = Object.values(criteria).every((v) => v === true);

    if (allCriteriaMet && enrollment.enrollmentId) {
      // Issue certificate
      const certificateNumber = `CERT-${enrollment.cohort.cohortCode}-${enrollment.candidateId}-${Date.now()}`;

      await prisma.certificate.create({
        data: {
          tenantId: enrollment.cohort.tenantId,
          enrollmentId: enrollment.enrollmentId,
          candidateId: enrollment.candidateId,
          courseId: enrollment.cohort.courseId,
          certificateNumber,
          issueDate: new Date(),
          expiryDate: null, // Set based on course requirements
          status: 'ISSUED',
          verificationCode: this.generateVerificationCode(),
        },
      });

      // Update cohort enrollment
      await prisma.cohortEnrollment.update({
        where: { id: cohortEnrollmentId },
        data: {
          certificationIssued: true,
        },
      });

      console.log(`Certificate issued for cohort enrollment ${cohortEnrollmentId}`);
      return true;
    }

    return false;
  }

  /**
   * Auto-mark student as placement ready
   */
  async checkPlacementReadiness(cohortEnrollmentId) {
    const enrollment = await prisma.cohortEnrollment.findUnique({
      where: { id: cohortEnrollmentId },
    });

    if (!enrollment) return;

    const isReady =
      enrollment.status === 'COMPLETED' &&
      enrollment.attendanceRate >= 80 &&
      enrollment.assessmentsPassed > 0 &&
      enrollment.vettingStatus === 'CLEARED' &&
      enrollment.certificationIssued;

    if (isReady && !enrollment.placementReady) {
      await prisma.cohortEnrollment.update({
        where: { id: cohortEnrollmentId },
        data: {
          placementReady: true,
        },
      });

      console.log(`Student marked as placement ready: ${cohortEnrollmentId}`);
    }
  }

  /**
   * Process cohort lifecycle automation
   * Called by scheduled job
   */
  async processCohortLifecycle() {
    const now = new Date();

    // 1. Auto-open enrollment 30 days before start date
    const cohortsToOpen = await prisma.cohort.findMany({
      where: {
        status: 'PUBLISHED',
        startDate: {
          gte: now,
          lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      },
    });

    for (const cohort of cohortsToOpen) {
      await prisma.cohort.update({
        where: { id: cohort.id },
        data: { status: 'ENROLLMENT_OPEN' },
      });
      console.log(`Auto-opened enrollment for cohort ${cohort.id}`);
    }

    // 2. Auto-close enrollment at deadline
    const cohortsToClose = await prisma.cohort.findMany({
      where: {
        status: 'ENROLLMENT_OPEN',
        enrollmentDeadline: {
          lte: now,
        },
      },
    });

    for (const cohort of cohortsToClose) {
      await this.closeCohortEnrollment(cohort.id, 'Deadline reached');
    }

    // 3. Auto-start training on start date
    const cohortsToStart = await prisma.cohort.findMany({
      where: {
        status: { in: ['ENROLLMENT_CLOSED', 'ENROLLMENT_OPEN'] },
        startDate: {
          lte: now,
        },
      },
    });

    for (const cohort of cohortsToStart) {
      await this.startCohortTraining(cohort.id);
    }

    // 4. Auto-complete training on end date
    const cohortsToComplete = await prisma.cohort.findMany({
      where: {
        status: 'IN_TRAINING',
        endDate: {
          lte: now,
        },
      },
    });

    for (const cohort of cohortsToComplete) {
      await this.completeCohort(cohort.id);
    }

    console.log('Cohort lifecycle processing completed');
  }

  /**
   * Generate verification code for certificates
   */
  generateVerificationCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Update attendance and assessment progress
   */
  async updateStudentProgress(cohortEnrollmentId) {
    // This would be called after attendance/assessment is recorded
    const enrollment = await prisma.cohortEnrollment.findUnique({
      where: { id: cohortEnrollmentId },
      include: {
        cohort: {
          include: {
            sessions: true,
          },
        },
      },
    });

    if (!enrollment) return;

    // Calculate total sessions
    const totalSessions = enrollment.cohort.sessions.length;

    // Update progress
    await prisma.cohortEnrollment.update({
      where: { id: cohortEnrollmentId },
      data: {
        totalSessions,
        attendanceRate: totalSessions > 0 ? (enrollment.attendanceCount / totalSessions) * 100 : 0,
      },
    });

    // Check if ready for certificate
    await this.checkAndIssueCertificate(cohortEnrollmentId);

    // Check if ready for placement
    await this.checkPlacementReadiness(cohortEnrollmentId);

    // Update cohort metrics
    await this.updateCohortMetrics(enrollment.cohortId);
  }
}

module.exports = new CohortAutomationService();
