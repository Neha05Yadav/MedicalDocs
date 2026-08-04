const mysql = require('mysql2/promise');

async function debugGetDoctors() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const userEmail = 'hospital@demo.com';

  const [hospitalRows] = await pool.execute('SELECT * FROM hospital WHERE email = ? AND type = "HOSPITAL"', [userEmail]);
  const hospital = hospitalRows[0];
  console.log("HOSPITAL:", hospital);

  if (!hospital) {
    console.log("NO HOSPITAL!");
    return;
  }

  const [doctors] = await pool.execute('SELECT * FROM doctor WHERE hospitalId = ? ORDER BY name ASC', [hospital.id]);
  console.log("DOCTORS:", doctors);

  for (let i = 0; i < doctors.length; i++) {
    const d = doctors[i];
    console.log(`DOCTOR ${i}:`, d);
    try {
      const [rows] = await pool.execute('SELECT COUNT(DISTINCT patientId) as c FROM accessrequest WHERE doctorId = ? AND hospitalId = ?', [d.id, hospital.id]);
      console.log(`ACTIVE PATIENTS for doctor ${d.id}:`, rows[0].c);
    } catch(e) {
      console.error(`ERROR for doctor ${d.id}:`, e);
    }
  }

  await pool.end();
}

debugGetDoctors();
