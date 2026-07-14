const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

async function main() {
  const password = await bcrypt.hash('123456', 10);
  
  const managementUsers = [
    { email: 'superadmin@demo.com', role: 'SUPER_ADMIN', name: 'Super Admin User' },
    { email: 'admin@demo.com', role: 'ADMIN', name: 'Admin User' },
    { email: 'accounts@demo.com', role: 'ACCOUNTS', name: 'Accounts Manager' },
    { email: 'sales@demo.com', role: 'SALES', name: 'Sales Manager' },
    { email: 'support@demo.com', role: 'SUPPORT', name: 'Support Representative' }
  ];

  for (const u of managementUsers) {
    const existingUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: uuidv4(),
          email: u.email,
          password: password,
          role: u.role,
          name: u.name,
          updatedAt: new Date(),
        }
      });
      console.log(`Created ${u.role}: ${u.email} / 123456`);
    } else {
      console.log(`${u.role} already exists: ${u.email}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
