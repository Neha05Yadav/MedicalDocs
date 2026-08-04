const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();

  if (!hospital) {
    console.log("No hospital found.");
    return;
  }

  await prisma.notification.createMany({
    data: [
      {
        hospitalId: hospital.id,
        type: "Alert",
        title: "System Maintenance",
        message: "Scheduled maintenance in 2 hours."
      },
      {
        hospitalId: hospital.id,
        type: "Request",
        title: "New Test Request",
        message: "Complete Blood Count request received."
      },
      {
        hospitalId: hospital.id,
        type: "Report",
        title: "Report Generated",
        message: "Lipid profile report is ready."
      }
    ]
  });

  console.log("Seeded Lab Notifications successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
