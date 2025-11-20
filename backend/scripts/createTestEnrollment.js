const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestEnrollment() {
  try {
    // Get candidate (alvin@gmail.com)
    const user = await prisma.user.findUnique({
      where: { email: 'alvin@gmail.com' },
      include: { candidateProfile: true }
    });

    if (!user || !user.candidateProfile) {
      console.error('❌ Candidate not found');
      return;
    }

    const candidate = user.candidateProfile;

    // Get a course they're not enrolled in yet
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { candidateId: candidate.id },
      select: { courseId: true }
    });

    const enrolledCourseIds = existingEnrollments.map(e => e.courseId);

    const availableCourse = await prisma.course.findFirst({
      where: {
        status: 'ACTIVE',
        id: { notIn: enrolledCourseIds }
      }
    });

    if (!availableCourse) {
      console.log('⚠️  No available courses to enroll in');
      return;
    }

    // Create enrollment with APPLIED status (pending approval)
    const enrollment = await prisma.enrollment.create({
      data: {
        candidateId: candidate.id,
        courseId: availableCourse.id,
        enrollmentStatus: 'APPLIED',
        paymentStatus: 'PENDING',
        enrollmentDate: new Date(),
        tenantId: 1
      },
      include: {
        course: true
      }
    });

    console.log('✅ Created test enrollment:');
    console.log('   Candidate:', candidate.fullName);
    console.log('   Course:', availableCourse.title);
    console.log('   Status: APPLIED (pending admin approval)');
    console.log('   Enrollment ID:', enrollment.id);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEnrollment();
