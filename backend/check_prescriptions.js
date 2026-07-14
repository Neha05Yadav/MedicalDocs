const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [p] = await conn.query('SELECT * FROM prescription');
  console.log('Prescriptions:', p.length);
  if(p.length > 0) console.log(p[0]);
  
  const [h] = await conn.query('SELECT id, type, name FROM hospital WHERE type = "CLINIC"');
  console.log('Clinics:', h.length);
  await conn.end();
}
run().catch(console.error);
