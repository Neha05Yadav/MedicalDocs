const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
    
    // Check if Apollo Care Center exists
    const [hospitals] = await conn.execute('SELECT * FROM hospital WHERE name LIKE "%Apollo%"');
    if (hospitals.length > 0) {
      const h = hospitals[0];
      const newName = 'City Hospital';
      const newEmail = 'care@cityhospital.com';
      const newPhone = '9988776655';
      
      // Generate ID
      const initials = newName.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
      const safePhone = newPhone || '000';
      const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
      const last2Year = new Date().getFullYear().toString().slice(-2);
      const newId = `${initials}${last3Phone}${last2Year}`;

      try {
        await conn.execute('SET FOREIGN_KEY_CHECKS=0');
        // Update user first
        await conn.execute('UPDATE user SET hospitalId = ? WHERE hospitalId = ?', [newId, h.id]);
        await conn.execute('UPDATE user SET email = ? WHERE email = ?', [newEmail, h.email]);
        
        const tables = [
          'user', 'doctor', 'medicalrecord', 'notification', 'support_ticket', 
          'hospital_profile', 'testrequest', 'invoice', 'sample'
        ];
        
        for (const t of tables) {
          try {
            await conn.execute(`UPDATE ${t} SET hospitalId = ? WHERE hospitalId = ?`, [newId, h.id]);
          } catch (e) {} // ignore if column doesn't exist
        }
        
        await conn.execute('UPDATE user SET email = ? WHERE email = ?', [newEmail, h.email]);

        // Finally update hospital table
        await conn.execute('UPDATE hospital SET id = ?, name = ?, email = ? WHERE id = ?', [newId, newName, newEmail, h.id]);
        await conn.execute('SET FOREIGN_KEY_CHECKS=1');

        console.log('Successfully updated Apollo Care Center to City Hospital with ID:', newId);
      } catch (err) {
        console.error('Update failed:', err.message);
      }
    } else {
      console.log('Apollo Care Center not found.');
    }
    
    conn.end();
  } catch (err) {
    console.error(err);
  }
})();
