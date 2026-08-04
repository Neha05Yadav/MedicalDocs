import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.error("No hospital found!");
    return;
  }

  const patients = await prisma.patient.findMany({ take: 3 });

  if (patients.length === 0) {
    console.error("No patients found!");
    return;
  }

  const samplesData = [
    { patient: patients[0], type: "Blood", status: "Collected" },
    { patient: patients[1] || patients[0], type: "Urine", status: "In Transit" },
    { patient: patients[2] || patients[0], type: "Swab", status: "Processing" }
  ];

  for (const s of samplesData) {
    const created = await prisma.sample.create({
      data: {
        patientId: s.patient.id,
        hospitalId: hospital.id,
        sampleType: s.type,
        status: s.status
      }
    });
    console.log("Created sample for patient:", s.patient.name, "Type:", created.sampleType);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
