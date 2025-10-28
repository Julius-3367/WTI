// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!');

    console.log('\nFetching users...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`\nFound ${users.length} users:\n`);
    console.table(users.map(user => ({
      ID: user.id,
      Email: user.email,
      Name: `${user.firstName} ${user.lastName}`,
      Phone: user.phone,
      Role: user.role?.name || 'N/A',
      Active: user.isActive ? '✅' : '❌',
      'Created At': user.createdAt.toISOString().split('T')[0]
    })));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
