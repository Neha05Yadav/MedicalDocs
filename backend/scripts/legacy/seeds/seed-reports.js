const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find some patients and hospitals
  const patient = await prisma.patient.findFirst();
  const hospital = await prisma.hospital.findFirst({ where: { type: 'LAB' } });
  
  if (!patient || !hospital) {
    console.log("No patient or hospital found. Create them first.");
    return;
  }

  // Create some medical records
  const records = [
    { title: "Complete Blood Count", type: "Blood Test", date: new Date("2026-06-22") },
    { title: "Brain MRI Scan", type: "MRI Scan", date: new Date("2026-06-21") },
    { title: "Chest X-Ray", type: "X-Ray", date: new Date("2026-06-20") },
    { title: "Urine Routine", type: "Urine Analysis", date: new Date("2026-06-19") },
  ];

  for (const record of records) {
    await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        hospitalId: hospital.id,
        title: record.title,
        type: record.type,
        date: record.date,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    });
  }
  
  console.log("Seeded reports successfully");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
