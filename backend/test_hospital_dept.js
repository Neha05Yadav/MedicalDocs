const { MysqlService } = require('./dist/mysql/mysql.service');
const mysql = new MysqlService();
async function run() {
  await mysql.onModuleInit();
  try {
    const rows = await mysql.query('SELECT d.specialization as name, COUNT(DISTINCT d.id) as doctors, COUNT(a.id) as patients FROM doctor d LEFT JOIN appointment a ON d.id = a.doctorId GROUP BY d.specialization');
    console.log(rows);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
