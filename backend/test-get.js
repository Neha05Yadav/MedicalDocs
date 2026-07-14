const mysql = require('mysql2/promise');
async function run() {
  const db = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  const [patient] = await db.query('SELECT id, name FROM patient WHERE email = ?', ['makejoh518@heavty.com']);
  console.log('Patient:', patient);
  const [requests] = await db.query(`SELECT r.*, h.name as hospitalName, d.name as doctorName FROM accessrequest r LEFT JOIN hospital h ON r.hospitalId = h.id LEFT JOIN doctor d ON r.doctorId = d.id WHERE r.patientId = ? ORDER BY r.requestDate DESC`, [patient[0].id]);
  console.log('Requests:', requests);
  process.exit(0);
}
run();
