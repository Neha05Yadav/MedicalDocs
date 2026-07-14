const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  const [rows] = await conn.execute("SELECT TABLE_NAME FROM information_schema.COLUMNS WHERE COLUMN_NAME = 'hospitalId' AND TABLE_SCHEMA = 'medico'");
  console.log(rows.map(r => r.TABLE_NAME));
  conn.end();
})();
