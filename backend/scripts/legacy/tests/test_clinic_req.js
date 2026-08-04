const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({host:'localhost',user:'root',password:'admin123',database:'medidoc'});
  
  // 1. Get a clinic
  const [clinics] = await c.query('SELECT * FROM clinic LIMIT 1');
  const clinic = clinics[0];
  console.log("Clinic:", clinic.name);

  // 2. Get a real patient
  const [patients] = await c.query('SELECT * FROM patient LIMIT 1');
  const patient = patients[0];
  console.log("Patient:", patient.name);

  // 3. Simulate clinic requesting access
  const [existing] = await c.query('SELECT * FROM accessrequest WHERE hospitalId = ? AND patientId = ?', [clinic.id, patient.id]);
  
  if (existing.length === 0) {
    console.log("Inserting access request...");
    await c.query(
      'INSERT INTO accessrequest (id, patientId, hospitalId, doctorId, status, updatedAt, requestDate, createdAt, reportTypes, reason, priority, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), patient.id, clinic.id, clinic.userId, 'PENDING', new Date(), new Date(), new Date(), 'All Reports', 'Consultation', 'Normal', '24 Hours']
    );
  }

  // 4. Simulate notification
  const [users] = await c.query('SELECT id FROM user WHERE email = ?', [patient.email]);
  if (users.length > 0) {
    const userForNotif = users[0];
    console.log("Inserting notification for user:", userForNotif.id);
    await c.query(
      'INSERT INTO notification (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), userForNotif.id, 'ACCESS_REQUEST', 'New Access Request', 'Clinic requested access', false, true, new Date(), new Date()]
    );
  }

  console.log("Done");
  c.end();
})();
