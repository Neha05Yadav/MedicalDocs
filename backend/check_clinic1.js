const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [h] = await conn.query('SELECT id, type, name FROM hospital WHERE id = "clinic-1"');
  console.log(h);
  await conn.end();
}
run().catch(console.error);
