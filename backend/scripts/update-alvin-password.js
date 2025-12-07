const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAlvinPassword() {
  try {
    // Find Alvin
    const alvin = await prisma.user.findUnique({
      where: { email: 'alvin@gmail.com' },
      include: { role: true, candidateProfile: true }
    });
    
    if (alvin) {
      console.log('Found user:', alvin.email);
      console.log('Role:', alvin.role.name);
      console.log('Has candidate profile:', !!alvin.candidateProfile);
      
      // Set password
      const hashedPassword = await bcrypt.hash('candidate123', 12);
      await prisma.user.update({
        where: { id: alvin.id },
        data: { password: hashedPassword }
      });
      
      console.log('\n✅ Password updated for Alvin Kitoto');
      console.log('Credentials: alvin@gmail.com / candidate123');
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAlvinPassword();
