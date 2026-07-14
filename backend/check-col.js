const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  const [rows] = await conn.execute('SHOW FULL COLUMNS FROM hospital');
  console.log(rows.find(r => r.Field === 'id'));
  conn.end();
})();
