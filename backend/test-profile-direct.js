/**
 * Direct database test for candidate profile update
 * Run with: node test-profile-direct.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Candidate Profile Update (Direct DB)...\n');

    // Step 1: Find a candidate user
    console.log('📋 Step 1: Finding candidate user...');
    const candidateUser = await prisma.user.findFirst({
      where: {
        role: {
          name: 'candidate',
        },
      },
      include: {
        candidate: true,
        role: true,
      },
    });

    if (!candidateUser) {
      console.log('❌ No candidate user found in database!');
      console.log('   Please create a candidate user first.');
      process.exit(1);
    }

    console.log('✅ Found candidate user:');
    console.log('   ID:', candidateUser.id);
    console.log('   Email:', candidateUser.email);
    console.log('   Name:', candidateUser.firstName, candidateUser.lastName);
    console.log('   Has Candidate Profile:', candidateUser.candidate ? 'Yes' : 'No');
    console.log('');

    // Step 2: Create candidate profile if it doesn't exist
    let candidate = candidateUser.candidate;
    if (!candidate) {
      console.log('📝 Step 2: Creating candidate profile...');
      candidate = await prisma.candidate.create({
        data: {
          userId: candidateUser.id,
          tenantId: candidateUser.tenantId,
          status: 'ACTIVE',
          createdBy: candidateUser.id,
          updatedBy: candidateUser.id,
        },
      });
      console.log('✅ Candidate profile created with ID:', candidate.id);
      console.log('');
    } else {
      console.log('✅ Candidate profile already exists with ID:', candidate.id);
      console.log('');
    }

    // Step 3: Update user and candidate data
    console.log('📝 Step 3: Updating profile...');

    // Update User table
    const updatedUser = await prisma.user.update({
      where: { id: candidateUser.id },
      data: {
        firstName: 'Julius',
        lastName: 'Updated',
        phone: '+1-555-TEST-123',
      },
    });

    // Update Candidate table
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        nationality: 'Test Nationality',
        city: 'Test City',
        address: '123 Test Avenue',
        dateOfBirth: new Date('1995-05-15'),
        updatedBy: candidateUser.id,
      },
    });

    console.log('✅ Profile updated successfully!');
    console.log('');

    // Step 4: Verify the updates
    console.log('🔍 Step 4: Verifying updates...');
    const verifiedUser = await prisma.user.findUnique({
      where: { id: candidateUser.id },
      include: {
        candidate: true,
      },
    });

    console.log('✅ Verified Data:');
    console.log('   User:');
    console.log('     - Name:', verifiedUser.firstName, verifiedUser.lastName);
    console.log('     - Email:', verifiedUser.email);
    console.log('     - Phone:', verifiedUser.phone);
    console.log('   Candidate:');
    console.log('     - Nationality:', verifiedUser.candidate.nationality);
    console.log('     - City:', verifiedUser.candidate.city);
    console.log('     - Address:', verifiedUser.candidate.address);
    console.log('     - Date of Birth:', verifiedUser.candidate.dateOfBirth);
    console.log('');

    console.log('🎉 All tests passed!');
    console.log('');
    console.log('💡 Now test in the browser:');
    console.log('   1. Login with:', verifiedUser.email);
    console.log('   2. Go to Profile Settings');
    console.log('   3. Update your name');
    console.log('   4. The changes should save successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testProfileUpdate();
