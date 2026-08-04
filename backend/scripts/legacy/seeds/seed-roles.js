const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoles() {
  const roles = [
    { name: 'Sales Manager', description: 'Manage subscriptions, track revenue and generate reports.', color: 'emerald', icon: 'TrendingUp', modules: JSON.stringify(["Dashboard", "Revenue Analytics", "Subscription Management", "Reports"]) },
    { name: 'Accounts Manager', description: 'Handle payments, billing and financial reporting.', color: 'orange', icon: 'FileText', modules: JSON.stringify(["Payments", "Financial Reports", "Billing Records"]) },
    { name: 'Support Agent', description: 'Manage support tickets, verification and escalations.', color: 'purple', icon: 'Headset', modules: JSON.stringify(["Support Tickets", "Escalation Management", "User Verification"]) }
  ];

  for (const role of roles) {
    await prisma.systemRole.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }
  console.log('Roles seeded');
}

seedRoles().catch(console.error).finally(() => prisma.$disconnect());
