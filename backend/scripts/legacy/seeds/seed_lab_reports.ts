import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.error("No hospital found!");
    return;
  }

  // Find some patients
  const patients = await prisma.patient.findMany({
    take: 3
  });

  if (patients.length === 0) {
    console.error("No patients found! Cannot seed reports.");
    return;
  }

  // Create some lab reports
  const reportsData = [
    { patient: patients[0], title: "Complete Blood Count", category: "Lab Report" },
    { patient: patients[0], title: "Lipid Profile", category: "Lab Report" },
    { patient: patients[1] || patients[0], title: "Thyroid Panel", category: "Pathology" },
    { patient: patients[2] || patients[0], title: "Urine Analysis", category: "Microbiology" }
  ];

  for (const r of reportsData) {
    const created = await prisma.medicalRecord.create({
      data: {
        patientId: r.patient.id,
        hospitalId: hospital.id,
        title: r.title,
        type: 'LAB_REPORT',
        description: r.category,
        fileUrl: "dummy_report.pdf",
        date: new Date()
      }
    });
    console.log("Created lab report for:", r.patient.name, "Title:", created.title);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
