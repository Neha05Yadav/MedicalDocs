const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
    
    const oldId = '55690b7a-4744-48ab-a6e6-f039a679d1cf';
    const newId = 'CH65526';
    
    const missedTables = [
      'accessrequest', 'appointment', 'hospitalsubscription', 'labservice', 'prescription'
    ];
    
    await conn.execute('SET FOREIGN_KEY_CHECKS=0');

    for (const t of missedTables) {
      try {
        const [res] = await conn.execute(`UPDATE ${t} SET hospitalId = ? WHERE hospitalId = ?`, [newId, oldId]);
        console.log(`Updated ${res.affectedRows} rows in ${t}`);
      } catch (e) {
        console.error(`Failed on ${t}:`, e.message);
      }
    }
    
    await conn.execute('SET FOREIGN_KEY_CHECKS=1');
    console.log('Successfully recovered missing patients data!');
    
    conn.end();
  } catch (err) {
    console.error(err);
  }
})();
