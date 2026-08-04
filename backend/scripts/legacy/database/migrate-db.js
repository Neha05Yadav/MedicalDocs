const mysql = require('mysql2/promise');

async function migrate() {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306');
    await conn.query('CREATE DATABASE IF NOT EXISTS medico;');
    
    const [tables] = await conn.query('SHOW TABLES FROM medidoc;');
    
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      console.log(`Copying table: ${tableName}`);
      await conn.query(`CREATE TABLE IF NOT EXISTS medico.${tableName} LIKE medidoc.${tableName};`);
      await conn.query(`INSERT IGNORE INTO medico.${tableName} SELECT * FROM medidoc.${tableName};`);
    }
    
    console.log('Successfully migrated medidoc to medico.');
    await conn.end();
  } catch (err) {
    console.error(err);
  }
}

migrate();
