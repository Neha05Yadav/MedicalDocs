const mysql = require('mysql2/promise');

async function migrateLabIds() {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  
  try {
    // 1. Get all labs with a UUID (length > 6)
    const [labs] = await conn.execute(
      `SELECT id, name FROM hospital WHERE type = 'LAB' AND LENGTH(id) > 6`
    );

    if (labs.length === 0) {
      console.log('No labs need migration.');
      return;
    }

    console.log(`Found ${labs.length} labs to migrate.`);

    // 2. Disable foreign key checks for safe updates
    await conn.execute('SET FOREIGN_KEY_CHECKS=0');

    // 3. Keep track of sequences in memory to handle multiple labs with the same prefix correctly
    const sequences = {};

    for (const lab of labs) {
      const oldId = lab.id;
      const name = lab.name || 'LA';
      
      let prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
      if (prefix.length < 2) prefix = (prefix + 'LA').substring(0, 2);

      let nextNum = 1;

      // If we haven't fetched the sequence for this prefix yet, get the current max from DB
      if (sequences[prefix] === undefined) {
        const [rows] = await conn.execute(
          `SELECT id FROM hospital WHERE type = 'LAB' AND id LIKE ? AND LENGTH(id) = 6 ORDER BY id DESC LIMIT 1`,
          [`${prefix}%`]
        );
        if (rows && rows.length > 0) {
          const lastId = rows[0].id;
          const lastNumStr = lastId.substring(2);
          const lastNum = parseInt(lastNumStr, 10);
          if (!isNaN(lastNum)) {
            nextNum = lastNum + 1;
          }
        }
        sequences[prefix] = nextNum;
      } else {
        nextNum = sequences[prefix];
      }

      // Generate new ID
      const newId = `${prefix}${String(nextNum).padStart(4, '0')}`;
      sequences[prefix] = nextNum + 1; // Increment for the next lab with the same prefix

      console.log(`Migrating Lab: ${name} | Old ID: ${oldId} -> New ID: ${newId}`);

      // 4. Update the hospital table
      await conn.execute(`UPDATE hospital SET id = ? WHERE id = ?`, [newId, oldId]);

      // 5. Update all referencing tables
      const tables = [
        'hospital_profile', 'accessrequest', 'appointment', 'doctor', 
        'hospitalsubscription', 'invoice', 'labservice', 'medicalrecord', 
        'notification', 'prescription', 'sample', 'testrequest', 'user'
      ];

      for (const table of tables) {
        try {
          const [res] = await conn.execute(`UPDATE ${table} SET hospitalId = ? WHERE hospitalId = ?`, [newId, oldId]);
          if (res.affectedRows > 0) {
            console.log(`  -> Updated ${res.affectedRows} rows in ${table}`);
          }
        } catch (e) {
          if (e.code !== 'ER_BAD_FIELD_ERROR' && e.code !== 'ER_NO_SUCH_TABLE') {
             console.error(`Error updating ${table}:`, e.message);
          }
        }
      }
    }

    // 6. Re-enable foreign key checks
    await conn.execute('SET FOREIGN_KEY_CHECKS=1');
    console.log('Migration completed successfully.');

  } catch (error) {
    console.error('Migration failed:', error);
    try {
      await conn.execute('SET FOREIGN_KEY_CHECKS=1');
    } catch(e) {}
  } finally {
    conn.end();
  }
}

migrateLabIds();
