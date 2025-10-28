const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create roles
  const roles = [
    {
      name: 'Admin',
      description: 'System administrator with full access',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        candidates: ['create', 'read', 'update', 'delete'],
        courses: ['create', 'read', 'update', 'delete'],
        placements: ['create', 'read', 'update', 'delete'],
        reports: ['read'],
        settings: ['read', 'update']
      }
    },
    {
      name: 'Trainer',
      description: 'Training instructor with course management access',
      permissions: {
        candidates: ['read', 'update'],
        courses: ['create', 'read', 'update'],
        enrollments: ['create', 'read', 'update'],
        attendance: ['create', 'read', 'update'],
        assessments: ['create', 'read', 'update']
      }
    },
    {
      name: 'Candidate',
      description: 'Training candidate with limited access',
      permissions: {
        profile: ['read', 'update'],
        documents: ['create', 'read', 'update'],
        progress: ['read']
      }
    },
    {
      name: 'Agent',
      description: 'Recruitment agent with candidate management access',
      permissions: {
        candidates: ['create', 'read', 'update'],
        documents: ['read'],
        placements: ['read']
      }
    },
    {
      name: 'Broker',
      description: 'Recruitment broker with referral access',
      permissions: {
        candidates: ['create', 'read'],
        referrals: ['create', 'read'],
        commissions: ['read']
      }
    },
    {
      name: 'Recruiter',
      description: 'Employer/Recruiter with placement access',
      permissions: {
        candidates: ['read'],
        placements: ['create', 'read', 'update'],
        jobs: ['create', 'read', 'update']
      }
    }
  ];

  console.log('📝 Creating roles...');
  for (const roleData of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: roleData
      });
      console.log(`✅ Created role: ${roleData.name}`);
    } else {
      console.log(`⏭️  Role already exists: ${roleData.name}`);
    }
  }

  // Create admin user
  const adminRole = await prisma.role.findUnique({
    where: { name: 'Admin' }
  });

  if (adminRole) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@labourmobility.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@labourmobility.com',
          password: hashedPassword,
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+254700000000',
          roleId: adminRole.id,
          isActive: true
        }
      });
      console.log('✅ Created admin user: admin@labourmobility.com');
    } else {
      console.log('⏭️  Admin user already exists');
    }
  }

  // Create sample trainer
  const trainerRole = await prisma.role.findUnique({
    where: { name: 'Trainer' }
  });

  if (trainerRole) {
    const existingTrainer = await prisma.user.findUnique({
      where: { email: 'trainer@labourmobility.com' }
    });

    if (!existingTrainer) {
      const hashedPassword = await bcrypt.hash('trainer123', 12);
      
      await prisma.user.create({
        data: {
          email: 'trainer@labourmobility.com',
          password: hashedPassword,
          firstName: 'John',
          lastName: 'Trainer',
          phone: '+254700000001',
          roleId: trainerRole.id,
          isActive: true
        }
      });
      console.log('✅ Created trainer user: trainer@labourmobility.com');
    } else {
      console.log('⏭️  Trainer user already exists');
    }
  }

  console.log('🎉 Database seed completed successfully!');
  console.log(`
📋 Default Users Created:
   Admin: admin@labourmobility.com / admin123
   Trainer: trainer@labourmobility.com / trainer123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
