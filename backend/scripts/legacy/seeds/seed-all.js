const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting comprehensive data seed...");

  // 1. Get or Create Core Entities
  let hospital = await prisma.hospital.findFirst({ where: { name: { contains: "City Care" } } });
  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: { name: "City Care Hospital", address: "123 Main St, Metro City", phone: "+91 9876543210", email: "contact@citycare.com" }
    });
  }

  let lab = await prisma.hospital.findFirst({ where: { name: { contains: "Apex Labs" } } });
  if (!lab) {
    lab = await prisma.hospital.create({
      data: { name: "Apex Labs", address: "Sector 5, Lab City", phone: "+91 8888888888", email: "hello@apexlabs.com" }
    });
  }

  // 2. Create Doctors
  const doctors = [];
  const doctorSpecs = ["Cardiology", "Neurology", "Orthopedics", "General Medicine"];
  for (let i = 1; i <= 4; i++) {
    const doc = await prisma.doctor.create({
      data: {
        name: `Dr. Ramesh ${i}`,
        specialization: doctorSpecs[i-1],
        phone: `+91 900000000${i}`,
        email: `ramesh${i}@citycare.com`,
        hospitalId: hospital.id,
        department: doctorSpecs[i-1],
        registrationNo: `MCI-${1000 + i}`,
        experience: `${5 + i} Years`,
        status: "Active"
      }
    });
    doctors.push(doc);
  }

  // 3. Create Patients
  const patients = [];
  const patientNames = ["Amit Kumar", "Priya Singh", "Rahul Sharma", "Sneha Gupta", "Vikram Rathore"];
  for (let i = 0; i < patientNames.length; i++) {
    const p = await prisma.patient.create({
      data: {
        name: patientNames[i],
        phone: `+91 999999990${i}`,
        email: `patient${i}@example.com`,
        bloodGroup: i % 2 === 0 ? "O+" : "A+",
        gender: i % 2 === 0 ? "Male" : "Female"
      }
    });
    patients.push(p);
  }

  // 4. Create Medical Records & Prescriptions
  for (const p of patients) {
    // Medical Record
    await prisma.medicalRecord.create({
      data: {
        patientId: p.id,
        hospitalId: hospital.id,
        title: "Initial Consultation Notes",
        description: "Patient visited for general checkup. No severe symptoms.",
        type: "CLINICAL_NOTE",
        date: new Date()
      }
    });

    // Prescription
    await prisma.prescription.create({
      data: {
        patientId: p.id,
        doctorId: doctors[0].id,
        hospitalId: hospital.id,
        medicine: "Paracetamol 500mg",
        dosage: "1-0-1 after meals",
        duration: "5 days",
        status: "Active"
      }
    });

    // Invoices
    await prisma.invoice.create({
      data: {
        patientId: p.id,
        hospitalId: hospital.id,
        consultationFee: 500,
        testFee: 0,
        totalAmount: 500,
        status: "Pending"
      }
    });
  }

  // 5. Create Test Requests and Samples for Lab
  for (let i = 0; i < 3; i++) {
    const tr = await prisma.testRequest.create({
      data: {
        patientId: patients[i].id,
        hospitalId: lab.id,
        doctorId: doctors[i].id,
        testType: i === 0 ? "Complete Blood Count" : (i === 1 ? "Lipid Profile" : "HbA1c"),
        status: "Pending",
        priority: i === 0 ? "High" : "Normal"
      }
    });

    await prisma.sample.create({
      data: {
        sampleType: "Blood",
        patientId: patients[i].id,
        testRequestId: tr.id,
        status: "Collected",
        hospitalId: lab.id
      }
    });
  }

  // 6. Access Requests
  await prisma.accessRequest.create({
    data: {
      patientId: patients[0].id,
      hospitalId: lab.id,
      status: "PENDING"
    }
  });

  await prisma.accessRequest.create({
    data: {
      patientId: patients[1].id,
      hospitalId: lab.id,
      status: "APPROVED"
    }
  });

  // 7. Notifications
  await prisma.notification.create({
    data: {
      hospitalId: hospital.id,
      type: "Alert",
      title: "New Patient Registered",
      message: "Vikram Rathore registered successfully.",
      isRead: false
    }
  });

  console.log("Database seeded successfully with massive mock data!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
