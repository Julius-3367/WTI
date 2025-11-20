const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDemoData() {
    try {
        // Get existing candidates and courses
        const candidates = await prisma.candidate.findMany({ take: 5 });
        const courses = await prisma.course.findMany({ take: 5 });

        if (candidates.length === 0 || courses.length === 0) {
            console.log('No candidates or courses found. Please seed data first.');
            return;
        }

        console.log('Creating demo enrollments...\n');

        const demoEnrollments = [
            { candidateIdx: 0, courseIdx: 1, progress: 100 },
            { candidateIdx: 1, courseIdx: 0, progress: 100 },
            { candidateIdx: 2, courseIdx: 2, progress: 100 },
            { candidateIdx: 3, courseIdx: 1, progress: 100 },
            { candidateIdx: 4, courseIdx: 3, progress: 100 },
        ];

        for (const demo of demoEnrollments) {
            const candidate = candidates[demo.candidateIdx] || candidates[0];
            const course = courses[demo.courseIdx] || courses[0];

            // Check if enrollment exists
            const existing = await prisma.enrollment.findFirst({
                where: {
                    candidateId: candidate.id,
                    courseId: course.id
                }
            });

            if (!existing) {
                const enrollment = await prisma.enrollment.create({
                    data: {
                        tenantId: candidate.tenantId,
                        candidateId: candidate.id,
                        courseId: course.id,
                        enrollmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
                        enrollmentStatus: 'COMPLETED',
                        paymentStatus: 'PAID'
                    }
                });

                console.log('✓ Created enrollment:', candidate.fullName, '-', course.title);
            } else {
                // Update to COMPLETED if not already
                if (existing.enrollmentStatus !== 'COMPLETED') {
                    await prisma.enrollment.update({
                        where: { id: existing.id },
                        data: {
                            enrollmentStatus: 'COMPLETED',
                            paymentStatus: 'PAID'
                        }
                    });
                    console.log('✓ Updated enrollment to COMPLETED:', candidate.fullName, '-', course.title);
                } else {
                    console.log('- Enrollment already exists:', candidate.fullName, '-', course.title);
                }
            }
        }

        console.log('\n✅ Demo enrollments ready!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createDemoData();
