const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '..', 'migrations');
const allowedName = /^\d{3}_[a-z][a-z0-9]*(?:_[a-z0-9]+)*\.sql$/;
const forbiddenSql = /^\s*(INSERT|UPDATE|DELETE|REPLACE|TRUNCATE)\b/im;
const forbiddenNameParts = [
  'restore', 'repair', 'correct', 'demo', 'seed', 'backfill', 'historical',
  'credential', 'login',
];

function validate() {
  const errors = [];
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(directory, file), 'utf8');
    if (!allowedName.test(file)) errors.push(`${file}: use NNN_feature_schema_name.sql format`);
    const normalizedName = file.toLowerCase();
    const forbiddenPart = forbiddenNameParts.find(part => normalizedName.includes(part));
    if (forbiddenPart) errors.push(`${file}: data/identity term "${forbiddenPart}" is not allowed in migrations`);
    const dataStatement = sql.match(forbiddenSql);
    if (dataStatement) errors.push(`${file}: ${dataStatement[1].toUpperCase()} belongs in seeds or scripts/data-fixes`);
    if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(sql))
      errors.push(`${file}: email/account-specific data is not allowed`);
  }
  if (errors.length) {
    console.error(`Migration validation failed:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Migration validation passed (${files.length} schema files).`);
}

validate();
