const mysql = require('mysql2/promise');

async function run() {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS clinic_patient (
        id VARCHAR(191) PRIMARY KEY,
        doctorId VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        age INT,
        gender VARCHAR(191),
        bloodGroup VARCHAR(191),
        lastVisit VARCHAR(191),
        diagnosis VARCHAR(255),
        followUp VARCHAR(191),
        status VARCHAR(191),
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);
    console.log('Table created successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
