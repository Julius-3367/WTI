const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to the database...');
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Try to query a table
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('Tables in the database:', tables);
    
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
