const mysql = require('mysql2/promise');

async function testQuery() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'medico'
  });
  
  try {
    const [rows] = await conn.execute('SELECT COUNT(DISTINCT patientId) as c FROM accessrequest WHERE doctorId = ? AND hospitalId = ?', ["ebef8514-a78c-436b-be54-f5685d24139a", "e9012a1b-d09a-4086-8685-d91ef752a2e7"]);
    console.log("Result:", rows[0]);
    if (!rows[0]) console.log("rows[0] is undefined");
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await conn.end();
  }
}

testQuery();
