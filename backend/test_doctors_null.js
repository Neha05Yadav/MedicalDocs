const mysql = require('mysql2/promise');

async function test() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [rows] = await conn.execute('SELECT * FROM doctor WHERE hospitalId = ? ORDER BY name ASC', ["e9012a1b-d09a-4086-8685-d91ef752a2e7"]);
  console.log("ROWS:", JSON.stringify(rows));
  console.log("IS ANY ROW NULL?", rows.some(r => r === null));
  await conn.end();
}
test();
