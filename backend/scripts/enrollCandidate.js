const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enrollCandidateInCourses() {
  try {
    // Get Alvin's candidate
    const user = await prisma.user.findFirst({
      where: { email: { contains: 'alvin' } }
    });

    const candidate = await prisma.candidate.findFirst({
      where: { userId: user.id }
    });

    console.log('Candidate:', candidate.id, candidate.fullName);

    // Get some active courses
    const courses = await prisma.course.findMany({
      where: {
        tenantId: candidate.tenantId,
        status: 'ACTIVE'
      },
      take: 3,
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\nEnrolling in ${courses.length} courses...`);

    // Create enrollments
    for (const course of courses) {
      const enrollment = await prisma.enrollment.create({
        data: {
          tenantId: candidate.tenantId,
          courseId: course.id,
          candidateId: candidate.id,
          enrollmentDate: new Date(),
          enrollmentStatus: 'ENROLLED',
          paymentStatus: 'PAID',
        }
      });

      console.log(`✅ Enrolled in: ${course.title} (${course.code})`);
    }

    console.log('\n✨ Enrollments created successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

enrollCandidateInCourses();
