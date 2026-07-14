const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [result] = await conn.query("UPDATE medicalrecord SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7' WHERE hospitalId = '2f3e5e4a-cb67-469c-91b9-3974f8d31b65' AND type != 'PRESCRIPTION'");
  console.log('Updated rows:', result.affectedRows);
  process.exit(0);
}
run();
