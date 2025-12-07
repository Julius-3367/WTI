const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function demonstrateWorkflow() {
  console.log('====================================================================');
  console.log('Student Cohort Enrollment Workflow');
  console.log('====================================================================\n');

  // Step 1: Show pending enrollment
  console.log('STEP 1: Current Enrollment Status');
  console.log('----------------------------------');
  const enrollment = await prisma.cohortEnrollment.findFirst({
    where: { cohortId: 3 },
    include: {
      candidate: { include: { user: true } },
      cohort: { include: { course: true } },
      enrollment: true,
    },
  });

  console.log(`Candidate: ${enrollment.candidate.fullName}`);
  console.log(`Cohort: ${enrollment.cohort.cohortName}`);
  console.log(`Course: ${enrollment.cohort.course.title}`);
  console.log(`Current Status: ${enrollment.status}`);
  console.log(`Has Main Enrollment: ${enrollment.enrollmentId ? 'Yes (ID: ' + enrollment.enrollmentId + ')' : 'No'}\n`);

  // Step 2: Approve and enroll
  if (enrollment.status !== 'ENROLLED') {
    console.log('STEP 2: Approving Application (Setting Status to ENROLLED)');
    console.log('------------------------------------------------------------');
    
    // Create main enrollment
    let mainEnrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: enrollment.cohort.courseId,
        candidateId: enrollment.candidateId,
      },
    });

    if (!mainEnrollment) {
      mainEnrollment = await prisma.enrollment.create({
        data: {
          tenantId: enrollment.cohort.tenantId,
          courseId: enrollment.cohort.courseId,
          candidateId: enrollment.candidateId,
          enrollmentDate: new Date(),
          enrollmentStatus: 'ENROLLED',
          paymentStatus: 'PENDING',
        },
      });
      console.log(`✅ Created main enrollment record (ID: ${mainEnrollment.id})`);
    } else {
      console.log(`✅ Using existing enrollment record (ID: ${mainEnrollment.id})`);
    }

    // Update cohort enrollment
    const updated = await prisma.cohortEnrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'ENROLLED',
        approvalDate: new Date(),
        enrollmentId: mainEnrollment.id,
      },
    });

    console.log(`✅ Updated cohort enrollment status to: ${updated.status}`);
    console.log(`✅ Approval date: ${updated.approvalDate}`);
    console.log(`✅ Linked to main enrollment: ${updated.enrollmentId}\n`);
  } else {
    console.log('Already enrolled\n');
  }

  // Step 3: Show what student sees
  console.log('STEP 3: Student View');
  console.log('--------------------');
  const studentCohorts = await prisma.cohortEnrollment.findMany({
    where: {
      candidateId: enrollment.candidateId,
      status: 'ENROLLED',
    },
    include: {
      cohort: { include: { course: true } },
    },
  });

  console.log(`Student has ${studentCohorts.length} enrolled cohort(s):`);
  studentCohorts.forEach(ce => {
    console.log(`  - ${ce.cohort.cohortName} (${ce.cohort.course.title})`);
    console.log(`    Start: ${ce.cohort.startDate.toISOString().split('T')[0]}`);
    console.log(`    End: ${ce.cohort.endDate.toISOString().split('T')[0]}`);
  });

  console.log('\n====================================================================');
  console.log('WORKFLOW COMPLETE');
  console.log('====================================================================\n');
  console.log('What happens when status changes to ENROLLED:');
  console.log('1. ✅ Main Enrollment record created (if not exists)');
  console.log('2. ✅ Cohort enrollment linked to main enrollment');
  console.log('3. ✅ Student can now access course materials');
  console.log('4. ✅ Attendance can be tracked');
  console.log('5. ✅ Assessments can be assigned');
  console.log('6. ✅ Progress is monitored');
  console.log('7. ✅ Certificate generated upon completion\n');
}

demonstrateWorkflow()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error:', error);
    prisma.$disconnect();
  });
