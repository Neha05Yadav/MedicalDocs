const mysql = require('mysql2/promise');
async function run() {
  const c = await mysql.createConnection({host:'localhost', user:'root', password:'', database:'medico'});
  const [m] = await c.query('DESCRIBE medicalrecord');
  console.log("medicalrecord:", m);
  const [p] = await c.query('DESCRIBE patient');
  console.log("patient:", p);
  await c.end();
}
run();
