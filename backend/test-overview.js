const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userEmail = 'johndoe@example.com';
  let patient = await prisma.patient.findFirst({
    where: { email: userEmail },
  });

  if (!patient) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    patient = await prisma.patient.create({
      data: {
        email: userEmail,
        name: user ? user.name : 'Unknown',
        phone: '',
        bloodGroup: 'Unknown',
      },
    });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { doctor: true, hospital: true },
    orderBy: { dateTime: 'desc' },
    take: 5,
  });

  const records = await prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
    orderBy: { date: 'desc' },
    take: 5,
  });

  let age = 'N/A';
  if (patient.dateOfBirth) {
    const diff = Date.now() - patient.dateOfBirth.getTime();
    age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
  }

  let lastVisitStr = 'No visits yet';
  const lastAppointment = appointments.find(a => a.status === 'COMPLETED');
  if (lastAppointment) {
    lastVisitStr = lastAppointment.dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else if (records.length > 0) {
    lastVisitStr = records[0].date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const timelineEvents = [];
  
  appointments.forEach(apt => {
    timelineEvents.push({
      id: 'apt-' + apt.id,
      date: apt.dateTime,
      dateStr: apt.dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: `${apt.doctor?.specialization || 'General'} Consultation`,
      desc: apt.notes || `Appointment at ${apt.hospital?.name || 'Hospital'}`,
      type: 'APPOINTMENT'
    });
  });

  records.forEach(rec => {
    timelineEvents.push({
      id: 'rec-' + rec.id,
      date: rec.date,
      dateStr: rec.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: rec.title,
      desc: rec.description || rec.type,
      type: 'RECORD'
    });
  });

  timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  const recentTimeline = timelineEvents.slice(0, 4);

  console.log(JSON.stringify({
    patientInfo: {
      name: patient.name,
      age: age,
      bloodGroup: patient.bloodGroup || 'Not Specified',
      lastVisit: lastVisitStr,
      gender: patient.gender || 'Not Specified',
    },
    timeline: recentTimeline,
    testResultsStats: {
      completed: records.filter(r => r.type === 'LAB_REPORT').length,
      pending: appointments.filter(a => a.status === 'SCHEDULED').length,
      abnormal: 0,
    },
    recentReports: records.slice(0, 3).map(r => ({
      id: r.id,
      name: r.title,
      date: r.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: r.type,
      size: '1.2 MB'
    }))
  }, null, 2));
}
main().finally(() => prisma.$disconnect());
