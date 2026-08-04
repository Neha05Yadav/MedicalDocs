const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL || 'mysql://root:@localhost:3306/medico',
  );
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stored_file_prescription (
        storedFileId CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
        prescriptionId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (storedFileId, prescriptionId),
        UNIQUE KEY uq_prescription_image (prescriptionId),
        CONSTRAINT fk_prescription_file
          FOREIGN KEY (storedFileId) REFERENCES stored_file(id) ON DELETE CASCADE,
        CONSTRAINT fk_stored_file_prescription
          FOREIGN KEY (prescriptionId) REFERENCES prescription(id) ON DELETE CASCADE
      )
    `);
    console.log('Prescription image storage is ready.');
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
