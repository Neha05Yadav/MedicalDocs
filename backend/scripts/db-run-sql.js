const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function splitStatements(sql) {
  return sql.split(/;\s*(?:\r?\n|$)/).map(value => value.trim()).filter(Boolean);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required in backend/.env');
  const mode = argument('--mode');
  if (!['seeds', 'data-fix'].includes(mode)) throw new Error('Use --mode seeds or --mode data-fix');

  const root = path.join(__dirname, '..');
  const directory = mode === 'seeds'
    ? path.join(root, 'seeds')
    : path.join(root, 'scripts', 'data-fixes');
  const requestedFile = argument('--file');
  if (mode === 'data-fix' && !requestedFile)
    throw new Error('Data fixes require an explicit --file name');
  if (mode === 'data-fix' && !process.argv.includes('--confirm-data-fix'))
    throw new Error('Review the SQL, back up the database, then pass --confirm-data-fix');

  const files = requestedFile
    ? [requestedFile]
    : fs.readdirSync(directory).filter(file => file.endsWith('.sql')).sort();
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    for (const file of files) {
      const fullPath = path.resolve(directory, file);
      if (path.dirname(fullPath) !== path.resolve(directory) || !fs.existsSync(fullPath))
        throw new Error(`SQL file not found in ${directory}: ${file}`);
      console.log(`run ${mode}: ${file}`);
      const sql = fs.readFileSync(fullPath, 'utf8');
      await connection.beginTransaction();
      try {
        for (const statement of splitStatements(sql)) await connection.query(statement);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }
  } finally {
    await connection.end();
  }
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
