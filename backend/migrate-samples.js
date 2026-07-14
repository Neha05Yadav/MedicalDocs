const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  
  try {
    console.log("Adding columns to testrequest...");
    try { await conn.query(`ALTER TABLE testrequest ADD COLUMN sampleId VARCHAR(191) NULL`); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    try { await conn.query(`ALTER TABLE testrequest ADD COLUMN sampleCollectedAt DATETIME(3) NULL`); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    try { await conn.query(`ALTER TABLE testrequest ADD COLUMN assignedTo VARCHAR(191) NULL`); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    try { await conn.query(`ALTER TABLE testrequest ADD COLUMN rejectionReason TEXT NULL`); } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    
    console.log("Updating default status for testrequest...");
    await conn.query(`ALTER TABLE testrequest MODIFY status VARCHAR(191) NOT NULL DEFAULT 'Pending Collection'`);
    
    await conn.query(`UPDATE testrequest SET status = 'Pending Collection' WHERE status = 'Pending'`);

    console.log("Creating testrequest_status_history table...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS testrequest_status_history (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        testRequestId VARCHAR(191) NOT NULL,
        status VARCHAR(191) NOT NULL,
        updatedBy VARCHAR(191) NOT NULL,
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX testRequestId_idx (testRequestId)
      )
    `);

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await conn.end();
  }
}

run();
