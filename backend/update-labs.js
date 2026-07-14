const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.hospital.updateMany({ where: { name: { contains: 'Lab' } }, data: { type: 'LAB' } })
  .then(r => console.log('Updated', r.count))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
