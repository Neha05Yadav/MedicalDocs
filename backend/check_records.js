const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [records] = await conn.execute('SELECT * FROM medicalrecord WHERE patientId = "NY45626"');
  console.log(records);
  await conn.end();
}
run().catch(console.error);
