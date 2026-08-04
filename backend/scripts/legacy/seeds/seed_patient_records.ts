import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.error("No hospital found!");
    return;
  }

  // Find all patients to ensure whoever is logged in gets some records
  const patients = await prisma.patient.findMany();

  if (patients.length === 0) {
    console.error("No patients found!");
    return;
  }

  for (const patient of patients) {
    // Check if patient already has lots of records to avoid spamming
    const count = await prisma.medicalRecord.count({ where: { patientId: patient.id }});
    if (count > 5) continue;

    // Create some lab reports for this patient
    const reportsData = [
      { title: "Complete Blood Count", category: "Lab Report", type: 'LAB_REPORT' },
      { title: "Chest X-Ray", category: "Radiology", type: 'XRAY' },
      { title: "General Health Checkup", category: "Report", type: 'DOCUMENT' },
    ];

    for (const r of reportsData) {
      const created = await prisma.medicalRecord.create({
        data: {
          patientId: patient.id,
          hospitalId: hospital.id,
          title: r.title,
          type: r.type,
          description: r.category,
          fileUrl: "dummy_file.pdf",
          date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // random recent date
        }
      });
      console.log("Created record for patient:", patient.email, "Title:", created.title);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
