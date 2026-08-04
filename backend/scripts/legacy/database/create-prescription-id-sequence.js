const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL || 'mysql://root:@localhost:3306/medico',
  );
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS prescription_id_sequence (
        sequenceName VARCHAR(50) NOT NULL PRIMARY KEY,
        nextValue INT UNSIGNED NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
          ON UPDATE CURRENT_TIMESTAMP(3),
        CONSTRAINT chk_prescription_sequence_range
          CHECK (nextValue BETWEEN 10000 AND 100000)
      )
    `);
    await connection.execute(`
      INSERT INTO prescription_id_sequence (sequenceName, nextValue)
      SELECT 'prescription', GREATEST(
        10000,
        COALESCE(MAX(CASE
          WHEN id REGEXP '^RX[0-9]{5}$' THEN CAST(SUBSTRING(id, 3) AS UNSIGNED)
          WHEN id REGEXP '^[0-9]{5}$' THEN CAST(id AS UNSIGNED)
        END), 9999) + 1
      )
      FROM prescription
      ON DUPLICATE KEY UPDATE nextValue = GREATEST(
        prescription_id_sequence.nextValue,
        VALUES(nextValue)
      )
    `);
    console.log('Sequential five-digit prescription IDs are ready.');
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
