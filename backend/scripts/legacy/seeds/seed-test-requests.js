const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const patient = await prisma.patient.findFirst();
  const hospital = await prisma.hospital.findFirst();

  if (!patient || !hospital) {
    console.log("No patient or hospital found. Cannot seed test requests.");
    return;
  }

  await prisma.testRequest.createMany({
    data: [
      {
        patientId: patient.id,
        hospitalId: hospital.id,
        testType: "Complete Blood Count",
        status: "Pending",
        priority: "High"
      },
      {
        patientId: patient.id,
        hospitalId: hospital.id,
        testType: "Lipid Profile",
        status: "Accepted",
        priority: "Normal"
      },
      {
        patientId: patient.id,
        hospitalId: hospital.id,
        testType: "HbA1c",
        status: "Tested",
        priority: "Normal"
      },
      {
        patientId: patient.id,
        hospitalId: hospital.id,
        testType: "Liver Function Test",
        status: "Completed",
        priority: "Normal"
      }
    ]
  });

  console.log("Seeded Test Requests successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
