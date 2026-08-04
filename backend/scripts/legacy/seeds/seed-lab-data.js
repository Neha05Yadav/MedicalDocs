const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function main() {
  const labs = await prisma.hospital.findMany({ where: { type: 'LAB' } });

  for (const lab of labs) {
    console.log(`Seeding for Lab: ${lab.name}`);
    
    // Seed staff
    for (let i = 1; i <= 3; i++) {
      await prisma.user.create({
        data: {
          name: `Staff Member ${i} (${lab.name})`,
          email: `staff${i}_${lab.id.substring(0, 5)}@example.com`,
          password: 'password123', // Dummy
          role: i === 1 ? 'LAB_MANAGER' : 'TECHNICIAN',
          hospitalId: lab.id,
          status: 'Active'
        }
      });
    }

    // Seed services
    const services = [
      { name: 'Complete Blood Count (CBC)', price: 450, status: 'Approved' },
      { name: 'Lipid Profile', price: 800, status: 'Approved' },
      { name: 'Thyroid Panel (T3, T4, TSH)', price: 650, status: 'Pending' },
      { name: 'MRI Brain', price: 4500, status: 'Rejected' },
    ];

    for (const service of services) {
      await prisma.labService.create({
        data: {
          name: service.name,
          price: service.price,
          status: service.status,
          hospitalId: lab.id
        }
      });
    }
  }

  console.log('Done seeding lab data');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
