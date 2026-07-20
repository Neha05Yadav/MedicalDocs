const { MysqlService } = require('./dist/mysql/mysql.service');
const mysql = new MysqlService();
async function run() {
  await mysql.onModuleInit();
  const rows = await mysql.query('SELECT DISTINCT role FROM user');
  console.log(rows);
  process.exit(0);
}
run();
