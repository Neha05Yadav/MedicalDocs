const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const doctor = await prisma.doctor.findFirst(); 
  if (!doctor || !doctor.hospitalId) { 
    console.log('Doctor or Hospital missing, cannot add mock notifications.'); 
    return; 
  } 
  
  await prisma.notification.createMany({ 
    data: [ 
      { hospitalId: doctor.hospitalId, type: 'Request', title: 'Access Request Approved', message: 'Patient Rahul Sharma has approved your request to view their medical records.', isRead: false }, 
      { hospitalId: doctor.hospitalId, type: 'Appointment', title: 'New Appointment', message: 'Neha Gupta has booked an appointment for tomorrow at 10:30 AM.', isRead: false }, 
      { hospitalId: doctor.hospitalId, type: 'System', title: 'System Update', message: 'MediDoc platform maintenance scheduled for this weekend.', isRead: true }, 
    ] 
  }); 
  console.log('Successfully added 3 mock notifications!'); 
} 

main().catch(console.error).finally(() => prisma.$disconnect());
