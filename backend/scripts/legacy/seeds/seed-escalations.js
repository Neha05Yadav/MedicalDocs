const mysql = require('mysql2/promise');
const uuidv4 = require('uuid').v4;

(async () => {
  const db = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  
  const escalations = [
    {
      id: uuidv4(),
      ticketId: 'SUP-2026-0721-0012',
      userId: uuidv4(),
      userName: 'Dr. Ramesh Kumar',
      userRole: 'Clinic',
      category: 'Billing & Payments',
      subject: 'Payment gateway failing for premium appointments',
      description: 'Patients are unable to book appointments due to a recurring 500 error on the payment gateway integration.',
      priority: 'Critical',
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      ticketId: 'SUP-2026-0721-0015',
      userId: uuidv4(),
      userName: 'Apex Diagnostics Lab',
      userRole: 'Hospital',
      category: 'System Error',
      subject: 'Unable to upload bulk lab reports',
      description: 'The bulk upload feature is throwing timeout errors when trying to upload more than 10 reports at once.',
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      ticketId: 'SUP-2026-0720-0089',
      userId: uuidv4(),
      userName: 'City Care Hospital',
      userRole: 'Hospital',
      category: 'Account Access',
      subject: 'Multiple doctors locked out of portal',
      description: 'The authentication service seems to be rejecting valid credentials for 5 of our senior doctors.',
      priority: 'Critical',
      status: 'Open',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 40000000)
    },
    {
      id: uuidv4(),
      ticketId: 'SUP-2026-0719-0042',
      userId: uuidv4(),
      userName: 'Neha Yadav',
      userRole: 'Patient',
      category: 'Data Privacy',
      subject: 'Medical records not reflecting deleted status',
      description: 'I requested deletion of my old records but they are still visible in my profile history.',
      priority: 'High',
      status: 'Escalated',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 86400000)
    }
  ];
  
  for (const esc of escalations) {
    await db.query(`
      INSERT INTO support_ticket (id, ticketId, userId, userName, userRole, category, subject, description, priority, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [esc.id, esc.ticketId, esc.userId, esc.userName, esc.userRole, esc.category, esc.subject, esc.description, esc.priority, esc.status, esc.createdAt, esc.updatedAt]);
  }
  
  console.log('Escalation tickets inserted successfully!');
  db.end();
})();
