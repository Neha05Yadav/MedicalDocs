const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // We need to create some TestRequests and MedicalRecords to show data on Analytics page.

  // Get a random patient and hospital (just to satisfy relations)
  const patient = await prisma.patient.findFirst();
  const hospital = await prisma.hospital.findFirst();

  if (!patient || !hospital) {
    console.log("No patients or hospitals found to link data. Run seed-all.js first.");
    return;
  }

  // Create some Test Requests (Most requested tests)
  const testTypes = ['CBC', 'Lipid Profile', 'HbA1c', 'Thyroid', 'Vitamin D', 'Liver Panel'];
  
  for (let i = 0; i < 50; i++) {
    const randomTest = testTypes[Math.floor(Math.random() * testTypes.length)];
    await prisma.testRequest.create({
      data: {
        patientId: patient.id,
        hospitalId: hospital.id,
        testType: randomTest,
        status: 'Pending',
        priority: 'Normal'
      }
    });
  }

  // Create some Medical Records (Uploaded vs Verified)
  const recordStatuses = ['Verified', 'Pending', 'Flagged'];
  
  for (let i = 0; i < 30; i++) {
    const randomStatus = recordStatuses[Math.floor(Math.random() * recordStatuses.length)];
    await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        hospitalId: hospital.id,
        title: "Test Report " + i,
        type: 'Lab Report',
        fileUrl: 'http://example.com/report.pdf',
        status: randomStatus
      }
    });
  }

  console.log("Analytics data seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
