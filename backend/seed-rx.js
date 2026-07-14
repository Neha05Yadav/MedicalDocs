const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const doctor = await prisma.doctor.findFirst(); 
  const patient = await prisma.patient.findFirst(); 
  if (!doctor || !patient) { 
    console.log('Doctor or Patient missing, cannot add mock data.'); 
    return; 
  } 
  await prisma.prescription.createMany({ 
    data: [ 
      { patientId: patient.id, doctorId: doctor.id, medicine: 'Amlodipine 5mg', dosage: '1-0-0', duration: '30 Days', status: 'Active' }, 
      { patientId: patient.id, doctorId: doctor.id, medicine: 'Paracetamol 500mg', dosage: '1-0-1', duration: '5 Days', status: 'Completed' }, 
      { patientId: patient.id, doctorId: doctor.id, medicine: 'Amoxicillin 250mg', dosage: '1-0-1', duration: '7 Days', status: 'Active' } 
    ] 
  }); 
  console.log('Successfully added 3 mock prescriptions!'); 
} 

main().catch(console.error).finally(() => prisma.$disconnect());
