const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS support_ticket (
      id VARCHAR(36) PRIMARY KEY,
      ticketId VARCHAR(50) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      userName VARCHAR(100) NOT NULL,
      userRole VARCHAR(50) NOT NULL,
      category VARCHAR(100) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      attachment VARCHAR(255),
      priority VARCHAR(20) NOT NULL,
      status VARCHAR(20) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
  
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS support_ticket_reply (
      id VARCHAR(36) PRIMARY KEY,
      ticketId VARCHAR(36) NOT NULL,
      senderId VARCHAR(36) NOT NULL,
      senderName VARCHAR(100) NOT NULL,
      senderRole VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      createdAt DATETIME NOT NULL
    )
  `);
  
  console.log('Tables created');
  conn.end();
})();
