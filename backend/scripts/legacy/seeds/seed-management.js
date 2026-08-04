const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding management data...');

  // 1. Platform Settings
  await prisma.platformSetting.create({
    data: {
      websiteName: "Medidoc",
      maintenanceMode: false,
      require2fa: true,
    }
  });

  // 2. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actionType: "Login", entityType: "User", userEmail: "admin@medidoc.com", details: "Successful login" },
      { actionType: "Update", entityType: "Setting", userEmail: "admin@medidoc.com", details: "Updated security settings" }
    ]
  });

  // 3. Subscription Plans
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      name: "Basic",
      price: 5000,
      target: "Clinic",
      features: "[]",
    }
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: "Premium",
      price: 15000,
      target: "Hospital",
      features: "[]",
      popular: true
    }
  });

  console.log('Management data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
