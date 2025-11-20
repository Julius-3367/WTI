const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function createTestCertificates() {
    try {
        // Get some completed enrollments
        const enrollments = await prisma.enrollment.findMany({
            where: { enrollmentStatus: 'COMPLETED' },
            include: { candidate: true, course: true },
            take: 5
        });

        console.log('Found', enrollments.length, 'completed enrollments\n');

        for (const enrollment of enrollments) {
            // Check if certificate already exists
            const existing = await prisma.certificate.findUnique({
                where: {
                    tenantId_enrollmentId: {
                        tenantId: enrollment.tenantId,
                        enrollmentId: enrollment.id
                    }
                }
            });

            if (!existing) {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                const certNum = `CERT-${timestamp}-${random}`;
                const signatureData = certNum + enrollment.candidateId + enrollment.courseId;
                const digitalSignature = crypto.createHash('sha256').update(signatureData).digest('hex');

                await prisma.certificate.create({
                    data: {
                        tenantId: enrollment.tenantId,
                        enrollmentId: enrollment.id,
                        certificateNumber: certNum,
                        issueDate: new Date(),
                        status: 'ISSUED',
                        remarks: 'Successfully completed all course requirements and assessments.',
                        qrCode: JSON.stringify({ certificateNumber: certNum }),
                        digitalSignature: digitalSignature,
                        issuedBy: 1
                    }
                });

                console.log('✓ Created certificate', certNum, 'for', enrollment.candidate.fullName, '-', enrollment.course.title);
            } else {
                console.log('- Certificate already exists for', enrollment.candidate.fullName);
            }
        }

        console.log('\n✅ Done! Certificates created.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createTestCertificates();
