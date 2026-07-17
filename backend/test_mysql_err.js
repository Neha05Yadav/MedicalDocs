const mysql = require('mysql2/promise');

async function test() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  try {
    const hospital = {};
    await pool.execute('SELECT * FROM doctor WHERE hospitalId = ?', [hospital.id]);
  } catch(e) {
    console.error("UNDEFINED PARAM ERROR:", e.stack);
  }

  try {
    await pool.execute('SELECT * FROM doctor WHERE hospitalId = ?', [null]);
  } catch(e) {
    console.error("NULL PARAM ERROR:", e.stack);
  }
}
test();
