const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEnrollments() {
  try {
    // Find Alvin's user account
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { contains: 'alvin' } },
          { firstName: { contains: 'alvin' } }
        ]
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.id, user.email, `${user.firstName} ${user.lastName}`);

    // Find candidate profile
    const candidate = await prisma.candidate.findFirst({
      where: { userId: user.id }
    });

    if (!candidate) {
      console.log('❌ No candidate profile');
      return;
    }

    console.log('✅ Candidate ID:', candidate.id);

    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { candidateId: candidate.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true
          }
        }
      }
    });

    console.log('\n📚 Enrollments:', enrollments.length);
    enrollments.forEach(e => {
      console.log(`  - ${e.course.title} (${e.course.code})`);
      console.log(`    Status: ${e.enrollmentStatus}, Course Active: ${e.course.status}`);
    });

    // Get available courses
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const availableCourses = await prisma.course.count({
      where: {
        tenantId: candidate.tenantId,
        status: 'ACTIVE',
        id: { notIn: enrolledCourseIds.length > 0 ? enrolledCourseIds : undefined }
      }
    });

    console.log('\n📖 Available courses:', availableCourses);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollments();
