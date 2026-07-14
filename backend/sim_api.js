const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const patientId = 'NY45626';

  const [records] = await conn.query(`
    SELECT m.*, h.name as hospitalName, h.type as hospitalType 
    FROM medicalrecord m
    LEFT JOIN hospital h ON m.hospitalId = h.id
    WHERE m.patientId = ? AND m.type = 'PRESCRIPTION'
    ORDER BY m.date DESC
  `, [patientId]);
  
  const [doctorPrescriptions] = await conn.query(`
    SELECT p.*, h.name as hospitalName, h.type as hospitalType, d.name as doctorName
    FROM prescription p
    LEFT JOIN hospital h ON p.hospitalId = h.id
    LEFT JOIN doctor d ON p.doctorId = d.id
    WHERE p.patientId = ?
    ORDER BY p.createdAt DESC
  `, [patientId]);

  console.log("Records:", records.length);
  console.log("Doctor Prescriptions:", doctorPrescriptions.length);
  if (doctorPrescriptions.length > 0) {
    console.log("Sample:", doctorPrescriptions[0]);
  }
  await conn.end();
}
run().catch(console.error);
