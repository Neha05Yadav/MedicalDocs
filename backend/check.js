const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  const [rows] = await conn.execute("SELECT id, patientId, status, duration, updatedAt FROM accessrequest WHERE patientId = (SELECT id FROM patient WHERE name='Neha Yadav' LIMIT 1)");
  console.log(rows);
  conn.end();
}
run();
