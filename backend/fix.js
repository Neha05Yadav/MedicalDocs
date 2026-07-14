const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function fix() {
  console.log('Fixing...');
  const hash = await bcrypt.hash('password123', 10);
  
  // Update all existing passwords to hashed version
  await prisma.user.updateMany({ data: { password: hash } });
  
  // Ensure patients exist in User table
  try {
    await prisma.user.create({
      data: { email: 'emily.d@example.com', password: hash, role: 'PATIENT', name: 'Emily Davis' }
    });
  } catch(e) {}
  
  try {
    await prisma.user.create({
      data: { email: 'johndoe@example.com', password: hash, role: 'PATIENT', name: 'John Doe' }
    });
  } catch(e) {}
  
  console.log('Fixed passwords and added patients!');
  await prisma.$disconnect();
}
fix();
