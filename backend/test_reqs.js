const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({host:'localhost',user:'root',password:'admin123',database:'medidoc'});
  
  console.log("=== ACCESS REQUESTS ===");
  const [reqs] = await c.query('SELECT * FROM accessrequest ORDER BY requestDate DESC LIMIT 5');
  console.log(reqs);

  console.log("\n=== NOTIFICATIONS ===");
  const [notifs] = await c.query('SELECT * FROM notification ORDER BY createdAt DESC LIMIT 5');
  console.log(notifs);

  c.end();
})();
