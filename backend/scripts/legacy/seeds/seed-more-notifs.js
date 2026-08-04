const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst({ where: { name: { contains: "City Care" } } });
  const lab = await prisma.hospital.findFirst({ where: { name: { contains: "Apex Labs" } } });

  if (hospital) {
    await prisma.notification.createMany({
      data: [
        {
          hospitalId: hospital.id,
          type: "Request",
          title: "New Appointment Request",
          message: "Rahul Sharma requested an appointment for Cardiology.",
          isRead: false,
          actionRequired: true,
          createdAt: new Date(Date.now() - 15 * 60000)
        },
        {
          hospitalId: hospital.id,
          type: "Alert",
          title: "Payment Received",
          message: "Payment of ₹500 received from Sneha Gupta.",
          isRead: false,
          actionRequired: false,
          createdAt: new Date(Date.now() - 2 * 3600000)
        },
        {
          hospitalId: hospital.id,
          type: "System",
          title: "System Update Complete",
          message: "The billing module was successfully updated to v2.1.",
          isRead: true,
          actionRequired: false,
          createdAt: new Date(Date.now() - 24 * 3600000)
        }
      ]
    });
  }

  if (lab) {
    await prisma.notification.createMany({
      data: [
        {
          hospitalId: lab.id,
          type: "Request",
          title: "Urgent Test Request",
          message: "Dr. Ramesh 1 requested an urgent Lipid Profile for Amit Kumar.",
          isRead: false,
          actionRequired: true,
          createdAt: new Date(Date.now() - 5 * 60000)
        },
        {
          hospitalId: lab.id,
          type: "Alert",
          title: "Sample Collected",
          message: "Blood sample collected for Patient ID #9201.",
          isRead: false,
          actionRequired: false,
          createdAt: new Date(Date.now() - 4 * 3600000)
        },
        {
          hospitalId: lab.id,
          type: "System",
          title: "Equipment Maintenance",
          message: "Centrifuge machine requires calibration next week.",
          isRead: true,
          actionRequired: false,
          createdAt: new Date(Date.now() - 48 * 3600000)
        }
      ]
    });
  }

  console.log("Notifications seeded heavily for both Hospital and Lab.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
