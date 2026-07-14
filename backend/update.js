const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  await conn.execute("UPDATE accessrequest SET status='EXPIRED' WHERE patientId=(SELECT id FROM patient WHERE name='Neha Yadav' LIMIT 1)");
  console.log('Updated');
  conn.end();
}
run();
