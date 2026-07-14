const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [records] = await conn.query("SELECT * FROM medicalrecord WHERE title LIKE '%Lipid%'");
  console.log(records);
  process.exit(0);
}
run();
