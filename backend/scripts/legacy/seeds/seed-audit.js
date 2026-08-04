const mysql = require('mysql2/promise');
const uuidv4 = require('uuid').v4;

(async () => {
  const db = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  await db.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id VARCHAR(191) PRIMARY KEY,
      action_type VARCHAR(50) NOT NULL,
      user_email VARCHAR(191) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      details TEXT NOT NULL,
      ip_address VARCHAR(50),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    )
  `);
  
  await db.query(`DELETE FROM audit_log`);
  
  const logs = [
    { action: 'LOGIN', user: 'superadmin@medidoc.com', entity: 'Session', details: 'Successful login from new device', ip: '192.168.1.45' },
    { action: 'CREATE', user: 'superadmin@medidoc.com', entity: 'Hospital', details: 'Created new hospital profile: City Care Hospital', ip: '192.168.1.45' },
    { action: 'UPDATE', user: 'admin@medidoc.com', entity: 'SystemSettings', details: 'Updated global API rate limits', ip: '10.0.0.12' },
    { action: 'DELETE', user: 'superadmin@medidoc.com', entity: 'User', details: 'Deleted inactive user account: testuser@mail.com', ip: '192.168.1.45' },
    { action: 'CREATE', user: 'system', entity: 'Backup', details: 'Automated database backup completed successfully', ip: '127.0.0.1' },
    { action: 'UPDATE', user: 'superadmin@medidoc.com', entity: 'SubscriptionPlan', details: 'Modified pricing for Enterprise Plan', ip: '192.168.1.45' },
    { action: 'LOGIN', user: 'admin@medidoc.com', entity: 'Session', details: 'Failed login attempt: Invalid password', ip: '203.0.113.42' },
    { action: 'CREATE', user: 'admin@medidoc.com', entity: 'Laboratory', details: 'Approved and verified new laboratory: Apex Diagnostics', ip: '10.0.0.12' },
  ];
  
  for (const log of logs) {
    await db.query('INSERT INTO audit_log (id, action_type, user_email, entity_type, details, ip_address, createdAt) VALUES (?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? MINUTE))',
      [uuidv4(), log.action, log.user, log.entity, log.details, log.ip, Math.floor(Math.random() * 1000)]
    );
  }
  
  console.log('Audit logs inserted successfully!');
  db.end();
})();
