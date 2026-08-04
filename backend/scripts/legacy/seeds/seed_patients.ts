import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.error("No hospital found!");
    return;
  }

  // Create a doctor if not exists
  let doctor = await prisma.doctor.findFirst({ where: { hospitalId: hospital.id } });
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        name: "Rahul Verma",
        specialization: "General Physician",
        phone: "9876543210",
        hospitalId: hospital.id
      }
    });
    console.log("Created doctor:", doctor.name);
  }

  // Create some patients
  const patients = [
    { name: "Amit Kumar", phone: "9123456789", email: "amit@example.com", gender: "Male", dateOfBirth: new Date("1990-05-15") },
    { name: "Priya Singh", phone: "9988776655", email: "priya@example.com", gender: "Female", dateOfBirth: new Date("1985-08-20") },
    { name: "Rohan Sharma", phone: "9876543211", email: "rohan@example.com", gender: "Male", dateOfBirth: new Date("1975-12-10") },
    { name: "Sneha Patil", phone: "9112233445", email: "sneha@example.com", gender: "Female", dateOfBirth: new Date("2000-02-25") },
    { name: "Vikas Dubey", phone: "9223344556", email: "vikas@example.com", gender: "Male", dateOfBirth: new Date("1995-11-05") }
  ];

  for (const p of patients) {
    const created = await prisma.patient.create({ data: p });
    console.log("Created patient:", created.name);
    
    // Add dummy medical record so they have "Available Records"
    await prisma.medicalRecord.create({
      data: {
        patientId: created.id,
        hospitalId: hospital.id,
        title: "Initial Checkup Report",
        type: "PRESCRIPTION"
      }
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
