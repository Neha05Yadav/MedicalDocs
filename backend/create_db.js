const mysql = require('mysql2/promise');

async function createDatabase() {
  const commonPasswords = ['', 'root', '1234', '123456', 'password'];
  let connection = null;

  for (const password of commonPasswords) {
    try {
      console.log(`Trying to connect as root with password: '${password}'`);
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
      });
      console.log(`Successfully connected with password: '${password}'`);
      
      // Save password to a file so we can construct the Prisma URL
      const fs = require('fs');
      fs.writeFileSync('db_password.txt', password);
      break;
    } catch (e) {
      // console.log(`Failed with password '${password}': ${e.message}`);
    }
  }

  if (!connection) {
    console.error("Could not connect to MySQL with common root passwords. Please set the password manually.");
    process.exit(1);
  }

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS medidoc');
    console.log("Database 'medidoc' created or already exists.");
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await connection.end();
  }
}

createDatabase();
