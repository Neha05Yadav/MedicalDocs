const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
    
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS support_ticket_details (
        ticketId VARCHAR(36) PRIMARY KEY,
        assignedTo VARCHAR(100),
        internalNotes TEXT,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (ticketId) REFERENCES support_ticket(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    
    console.log('Created support_ticket_details table successfully!');
    conn.end();
  } catch (err) {
    console.error(err);
  }
})();
