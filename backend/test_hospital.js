const mysql = require('mysql2/promise');

async function checkHospital() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'medico'
  });
  
  try {
    const [desc] = await conn.execute('DESCRIBE hospital');
    console.log("Hospital Schema:", desc.map(d => d.Field).join(', '));
    
    const [hospitals] = await conn.execute('SELECT email, type FROM hospital');
    console.log("Hospitals:", hospitals);
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await conn.end();
  }
}

checkHospital();
