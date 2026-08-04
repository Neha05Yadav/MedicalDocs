const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const migrationsDirectory = path.join(__dirname, '..', 'migrations');
const aliasesPath = path.join(migrationsDirectory, 'legacy-aliases.json');
const legacyAliases = fs.existsSync(aliasesPath)
  ? JSON.parse(fs.readFileSync(aliasesPath, 'utf8'))
  : {};

function splitStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function executeStatement(connection, statement) {
  const executable = statement
    .replace(/^(?:\s*--[^\r\n]*(?:\r?\n|$))+/, '')
    .trim();
  if (!executable) return;
  const conditionalColumn = executable.match(
    /^ALTER\s+TABLE\s+`?([a-zA-Z0-9_]+)`?\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+`?([a-zA-Z0-9_]+)`?\s+([\s\S]+)$/i,
  );
  if (!conditionalColumn) {
    await connection.query(executable);
    return;
  }
  const [, tableName, columnName, definition] = conditionalColumn;
  const [rows] = await connection.query(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName],
  );
  if (!rows.length) {
    await connection.query(
      `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`,
    );
  }
}

async function main() {
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required in backend/.env');
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migration (
      version VARCHAR(120) PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      executedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    )
  `);

  const files = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDirectory, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    const [rows] = await connection.query(
      'SELECT checksum FROM schema_migration WHERE version = ?',
      [file],
    );
    if (rows.length) {
      if (rows[0].checksum !== checksum)
        throw new Error(`Applied migration was modified: ${file}`);
      console.log(`skip ${file}`);
      continue;
    }

    const legacy = legacyAliases[file];
    if (legacy) {
      const [legacyRows] = await connection.query(
        'SELECT checksum FROM schema_migration WHERE version = ?',
        [legacy.version],
      );
      if (legacyRows.length) {
        if (legacyRows[0].checksum !== legacy.checksum)
          throw new Error(`Applied legacy migration checksum mismatch: ${legacy.version}`);
        console.log(`skip ${file} (covered by legacy ${legacy.version})`);
        continue;
      }
    }

    console.log(`apply ${file}`);
    await connection.beginTransaction();
    try {
      for (const statement of splitStatements(sql))
        await executeStatement(connection, statement);
      await connection.query(
        'INSERT INTO schema_migration (version, checksum) VALUES (?, ?)',
        [file, checksum],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
  await connection.end();
  console.log(`Database is current (${files.length} migrations).`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
