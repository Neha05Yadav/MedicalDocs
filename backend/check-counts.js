const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection('mysql://root:admin123@localhost:3306/medico');
  const [rows1] = await conn.execute("SELECT COUNT(*) as c FROM medicalrecord WHERE hospitalId = 'CH65526'");
  const [rows2] = await conn.execute("SELECT COUNT(*) as c FROM accessrequest WHERE hospitalId = 'CH65526'");
  const [rows3] = await conn.execute("SELECT COUNT(*) as c FROM accessrequest WHERE hospitalId = '55690b7a-4744-48ab-a6e6-f039a679d1cf'");
  const [rows4] = await conn.execute("SELECT COUNT(*) as c FROM medicalrecord WHERE hospitalId = '55690b7a-4744-48ab-a6e6-f039a679d1cf'");
  console.log('CH65526 records:', rows1[0].c, 'access:', rows2[0].c);
  console.log('UUID records:', rows4[0].c, 'access:', rows3[0].c);
  conn.end();
})();
