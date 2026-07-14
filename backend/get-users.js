const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { 
      role: { in: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS', 'SALES', 'SUPPORT'] }
    },
    select: { email: true, role: true }
  });
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
