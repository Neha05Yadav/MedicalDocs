const fs = require('fs');
const line = "      const activePatientsRow = await this.db.queryOne('SELECT COUNT(DISTINCT patientId) as c FROM accessrequest WHERE doctorId = ? AND hospitalId = ?', [d.id, hospital.id]);";
console.log("Char at 151:", line.substring(140, 160));
