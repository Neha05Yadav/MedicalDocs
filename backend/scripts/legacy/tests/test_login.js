const mysql = require('mysql2/promise');

async function checkUsers() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'medico'
  });
  
  try {
    const [users] = await conn.execute('SELECT id, email, phone, role FROM user LIMIT 10');
    console.log("Users:", users);
    
    const [hospitals] = await conn.execute('SELECT id, name, email, phone FROM hospital WHERE type = "HOSPITAL" LIMIT 10');
    console.log("Hospitals:", hospitals);
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await conn.end();
  }
}

checkUsers();
