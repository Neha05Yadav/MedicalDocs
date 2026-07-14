const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  const [testReqs] = await conn.execute('SELECT * FROM testrequest WHERE patientId IN ("NY00026", "NY45626", "NY90126", "NY901261")');
  console.log(testReqs);
  await conn.end();
}
run().catch(console.error);
