const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst({
    where: { name: { contains: "Apex Labs" } }
  });

  if (!hospital) {
    console.log("No laboratory found");
    return;
  }

  const hospitalId = hospital.id;

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        hospitalId: hospitalId,
        type: "Request",
        title: "New Test Request",
        message: "Dr. Rohan Verma requested a Complete Blood Count for patient Rahul Sharma.",
        isRead: false,
        actionRequired: true,
        createdAt: new Date(Date.now() - 10 * 60000)
      },
      {
        hospitalId: hospitalId,
        type: "Alert",
        title: "Access Granted",
        message: "Patient Priya Singh granted you access to their medical history.",
        isRead: false,
        actionRequired: false,
        createdAt: new Date(Date.now() - 2 * 3600000)
      },
      {
        hospitalId: hospitalId,
        type: "Request",
        title: "New Walk-in Test",
        message: "Patient Amit Kumar registered for HbA1c test.",
        isRead: true,
        actionRequired: true,
        createdAt: new Date(Date.now() - 4 * 3600000)
      },
      {
        hospitalId: hospitalId,
        type: "System",
        title: "System Maintenance",
        message: "Scheduled maintenance tonight at 2:00 AM.",
        isRead: true,
        actionRequired: false,
        createdAt: new Date(Date.now() - 24 * 3600000)
      }
    ]
  });

  console.log("Notifications seeded for Apex Labs.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
