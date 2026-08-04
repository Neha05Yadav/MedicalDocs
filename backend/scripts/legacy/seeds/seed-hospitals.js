const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding unverified hospitals...");

  const h1 = await prisma.hospital.create({
    data: {
      name: "Green Valley Clinic",
      address: "123 Green Street, Delhi",
      phone: "+91 9876543210",
      email: "contact@greenvalley.com",
      licenseNumber: "LIC-2026-9821",
      status: "Pending",
      isVerified: false
    }
  });

  const h2 = await prisma.hospital.create({
    data: {
      name: "Sunrise Orthopedics",
      address: "45 MG Road, Mumbai",
      phone: "+91 9123456789",
      email: "info@sunriseortho.in",
      licenseNumber: "LIC-2026-4432",
      status: "Pending",
      isVerified: false
    }
  });

  const h3 = await prisma.hospital.create({
    data: {
      name: "Apollo Care Center",
      address: "Sector 14, Gurugram",
      phone: "+91 9988776655",
      email: "care@apollocenter.com",
      status: "Pending",
      isVerified: false
    }
  });

  console.log("Successfully added 3 unverified hospitals.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
