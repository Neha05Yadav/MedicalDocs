const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function run() {
  const hash = await bcrypt.hash('123456', 10);
  const conn = await mysql.createConnection({host: 'localhost', user: 'root', password: 'admin123', database: 'medico'});
  const [result] = await conn.query("UPDATE user SET password = ? WHERE password = '123456'", [hash]);
  console.log('Updated passwords to hash:', hash, 'Rows affected:', result.affectedRows);
  conn.end();
}
run();
