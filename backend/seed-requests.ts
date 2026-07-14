import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patient = await prisma.patient.findFirst();
  if (!patient) {
    console.log("No patient found");
    return;
  }

  // Create a dummy hospital if none exists
  let hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: {
        name: "City Care Hospital",
        address: "123 Main St",
        phone: "1234567890",
      }
    });
  }

  // Create a dummy doctor if none exists
  let doctor = await prisma.doctor.findFirst();
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        name: "Dr. Rajesh Kumar",
        specialization: "Cardiologist",
        phone: "0987654321",
        hospitalId: hospital.id
      }
    });
  }
  
  let doctor2 = await prisma.doctor.findFirst({ where: { name: "Dr. Priya Singh" } });
  if (!doctor2) {
    doctor2 = await prisma.doctor.create({
      data: {
        name: "Dr. Priya Singh",
        specialization: "Neurologist",
        phone: "1112223334",
        hospitalId: hospital.id
      }
    });
  }

  // Create dummy access requests
  await prisma.accessRequest.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      hospitalId: hospital.id,
      status: 'PENDING',
    }
  });

  await prisma.accessRequest.create({
    data: {
      patientId: patient.id,
      doctorId: doctor2.id,
      hospitalId: hospital.id,
      status: 'PENDING',
    }
  });

  console.log('Seeded Access Requests Successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
