const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update...\n');

    // 1. Find a candidate user
    const user = await prisma.user.findFirst({
      where: {
        role: {
          name: 'candidate'
        }
      },
      include: {
        role: true
      }
    });

    if (!user) {
      console.log('❌ No candidate user found. Please create one first.');
      return;
    }

    console.log('✅ Found candidate user:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role.name}\n`);

    // 2. Check if candidate profile exists
    let candidate = await prisma.candidate.findUnique({
      where: { userId: user.id }
    });

    if (!candidate) {
      console.log('⚠️  No candidate profile found. Creating one...');
      candidate = await prisma.candidate.create({
        data: {
          userId: user.id,
          tenantId: user.tenantId,
          status: 'ACTIVE',
          createdBy: user.id,
          updatedBy: user.id,
        }
      });
      console.log('✅ Candidate profile created!\n');
    } else {
      console.log('✅ Candidate profile exists\n');
    }

    // 3. Test update - Update user name and candidate info
    console.log('📝 Testing profile update...');

    const newFirstName = 'Updated';
    const newLastName = 'TestName';
    const newCounty = 'Test County';

    // Update User table (firstName, lastName, phone)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: newFirstName,
        lastName: newLastName,
        phone: '+1234567890',
      }
    });

    // Update Candidate table (county, preferredCountry, etc.)
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        county: newCounty,
        preferredCountry: 'Test Country',
        fullName: `${newFirstName} ${newLastName}`,
        updatedBy: user.id,
      }
    });

    console.log('✅ Profile updated successfully!\n');

    // 4. Verify the update
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: true,
        candidateProfile: true
      }
    });

    console.log('✅ Verification - Updated data:');
    console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`   Phone: ${updatedUser.phone || 'N/A'}`);
    console.log(`   Full Name: ${updatedUser.candidateProfile?.fullName || 'N/A'}`);
    console.log(`   County: ${updatedUser.candidateProfile?.county || 'N/A'}`);
    console.log(`   Preferred Country: ${updatedUser.candidateProfile?.preferredCountry || 'N/A'}\n`);

    // 5. Restore original values
    console.log('🔄 Restoring original values...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      }
    });

    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        county: candidate.county,
        preferredCountry: candidate.preferredCountry,
        fullName: candidate.fullName,
      }
    });

    console.log('✅ Original values restored!\n');
    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileUpdate();
