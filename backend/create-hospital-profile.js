const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
    
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS hospital_profile (
        id VARCHAR(36) PRIMARY KEY,
        hospitalId VARCHAR(191) NOT NULL UNIQUE,
        logoUrl VARCHAR(255),
        registrationNumber VARCHAR(191) UNIQUE,
        establishedYear VARCHAR(10),
        emergencyContact VARCHAR(20),
        website VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postalCode VARCHAR(20),
        adminName VARCHAR(100),
        adminDesignation VARCHAR(100),
        adminEmail VARCHAR(191),
        adminContact VARCHAR(20),
        departments TEXT,
        description TEXT,
        workingDays VARCHAR(100),
        openingTime VARCHAR(20),
        closingTime VARCHAR(20),
        emergencyServices BOOLEAN DEFAULT false,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('hospital_profile table created successfully');
    conn.end();
  } catch (err) {
    console.error(err);
  }
})();
