const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const notifications = [
    { type: "Alert", title: "High Server CPU Usage", message: "Server cluster 2 is experiencing >90% CPU usage.", severity: "High" },
    { type: "Info", title: "New Facility Registered", message: "Carewell Clinic has submitted a registration request.", severity: "Low" },
    { type: "Success", title: "System Backup Completed", message: "Daily automated database backup completed successfully.", severity: "Low" },
    { type: "Alert", title: "Payment Gateway Error", message: "Multiple failed transaction attempts from node 4.", severity: "High" },
    { type: "Info", title: "Scheduled Maintenance", message: "System will undergo maintenance on Sunday 2:00 AM.", severity: "Medium" }
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        title: notif.title,
        message: notif.message,
        type: notif.type,
        severity: notif.severity,
        hospitalId: null // Admin system notifications
      }
    });
  }
  
  console.log("Seeded admin notifications successfully");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
