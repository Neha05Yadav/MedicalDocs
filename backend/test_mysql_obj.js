const mysql = require('mysql2/promise');

async function test() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  try {
    await pool.execute('SELECT * FROM hospital WHERE email = ?', [{ id: null }]);
  } catch(e) {
    console.error("OBJECT PARAM ERROR:", e.stack);
  }
}
test();
