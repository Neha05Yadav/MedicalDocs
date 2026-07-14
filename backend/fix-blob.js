const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [result] = await conn.query("UPDATE medicalrecord SET fileUrl = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600' WHERE fileUrl LIKE 'blob:%'");
  console.log('Fixed blob URLs:', result.affectedRows);
  process.exit(0);
}
run();
