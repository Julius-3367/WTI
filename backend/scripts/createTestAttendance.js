const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestAttendance() {
  try {
    // Get candidate Alvin
    const user = await prisma.user.findUnique({
      where: { email: 'alvin@gmail.com' },
      include: { candidateProfile: true }
    });

    if (!user || !user.candidateProfile) {
      console.error('❌ Candidate not found');
      return;
    }

    const candidate = user.candidateProfile;

    // Get their enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        candidateId: candidate.id,
        enrollmentStatus: 'ENROLLED'
      },
      include: { course: true }
    });

    if (enrollments.length === 0) {
      console.log('⚠️  No active enrollments found');
      return;
    }

    console.log(`Found ${enrollments.length} active enrollments`);

    // Create attendance records for each enrollment
    for (const enrollment of enrollments) {
      // Create 10 attendance records over the past 2 weeks
      const attendanceRecords = [];
      for (let i = 0; i < 10; i++) {
        const daysAgo = i;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        // Vary status: mostly present, some late, few absent
        let status = 'PRESENT';
        if (i === 2) status = 'LATE';
        if (i === 7) status = 'ABSENT';
        if (i === 9) status = 'LATE';

        attendanceRecords.push({
          enrollmentId: enrollment.id,
          courseId: enrollment.courseId,
          candidateId: candidate.id,
          date: date,
          sessionNumber: i + 1,
          status: status,
          remarks: status === 'ABSENT' ? 'Sick leave' : status === 'LATE' ? 'Traffic delay' : 'On time',
          recordedBy: 1, // Admin user
          tenantId: 1
        });
      }

      await prisma.attendanceRecord.createMany({
        data: attendanceRecords,
        skipDuplicates: true
      });

      console.log(`✅ Created 10 attendance records for ${enrollment.course.title}`);
    }

    console.log('\n🎉 Test attendance data created successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAttendance();
