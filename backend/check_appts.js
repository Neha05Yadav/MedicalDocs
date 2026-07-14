const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [p] = await conn.query('SELECT * FROM appointment WHERE patientId = "NY45626"');
  console.log(p);
  await conn.end();
}
run().catch(console.error);
