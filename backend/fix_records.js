const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'medico' });
  
  const [testReqs] = await conn.execute('SELECT * FROM testrequest WHERE status = "Completed"');
  
  for (const testReq of testReqs) {
      console.log('Processing request:', testReq.id, 'for patient:', testReq.patientId);
      
      const fileUrl = "dummy_lab_report.pdf";
      
      // For Referring Hospital
      if (testReq.referringHospitalId) {
        // check if already exists
        const [existingRef] = await conn.execute('SELECT id FROM medicalrecord WHERE patientId = ? AND hospitalId = ? AND type = "LAB_REPORT"', [testReq.patientId, testReq.referringHospitalId]);
        if (existingRef.length === 0) {
            await conn.execute(`
              INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              uuidv4(), testReq.patientId, testReq.referringHospitalId, testReq.testType + ' Report', 'From Lab: Lab Report', 'LAB_REPORT', fileUrl, new Date(), new Date(), new Date()
            ]);
            console.log('Inserted record for referring hospital');
        }
      }
      
      // For Lab Dashboard
      const [existingLab] = await conn.execute('SELECT id FROM medicalrecord WHERE patientId = ? AND hospitalId = ? AND type = "LAB_REPORT"', [testReq.patientId, testReq.hospitalId]);
      if (existingLab.length === 0) {
          await conn.execute(`
            INSERT INTO medicalrecord (id, patientId, hospitalId, title, description, type, fileUrl, date, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            uuidv4(), testReq.patientId, testReq.hospitalId, testReq.testType + ' Report', 'Sent to referring hospital', 'LAB_REPORT', fileUrl, new Date(), new Date(), new Date()
          ]);
          console.log('Inserted record for lab dashboard');
      }
      
      // Notification for patient
      const [userForNotif] = await conn.execute('SELECT id FROM user WHERE phone = (SELECT phone FROM patient WHERE id = ?)', [testReq.patientId]);
      if (userForNotif.length > 0) {
          const userId = userForNotif[0].id;
          const [existingNotif] = await conn.execute('SELECT id FROM notification WHERE userId = ? AND title = "Lab Report Ready"', [userId]);
          if (existingNotif.length === 0) {
              await conn.execute(`
                INSERT INTO notification (id, userId, title, message, type, isRead, actionRequired, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                uuidv4(), userId, 'Lab Report Ready', `Your lab report for ${testReq.testType} is ready.`, 'Report', false, false, new Date(), new Date()
              ]);
              console.log('Inserted notification for patient');
          }
      } else {
          // If no user found, maybe patient signs in with patientId directly
          const [existingNotif] = await conn.execute('SELECT id FROM notification WHERE userId = ? AND title = "Lab Report Ready"', [testReq.patientId]);
          if (existingNotif.length === 0) {
              await conn.execute(`
                INSERT INTO notification (id, userId, title, message, type, isRead, actionRequired, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                uuidv4(), testReq.patientId, 'Lab Report Ready', `Your lab report for ${testReq.testType} is ready.`, 'Report', false, false, new Date(), new Date()
              ]);
              console.log('Inserted notification for patient directly by patientId');
          }
      }
  }
  
  await conn.end();
}

run().catch(console.error);
