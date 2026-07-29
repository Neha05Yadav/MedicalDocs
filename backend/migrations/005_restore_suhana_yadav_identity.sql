UPDATE patient
SET id = 'SY45826',
    name = 'Suhana Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE id = 'NY45826'
  AND LOWER(email) = 'yadav123@gmail.com';

UPDATE user
SET name = 'Suhana Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) = 'yadav123@gmail.com'
  AND UPPER(role) = 'PATIENT';

UPDATE accessrequest SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE appointment SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE invoice SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE medicalrecord SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE prescription SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE sample SET patientId = 'SY45826' WHERE patientId = 'NY45826';
UPDATE testrequest SET patientId = 'SY45826' WHERE patientId = 'NY45826';

UPDATE setting
SET `key` = 'profile.logo.patient.SY45826'
WHERE `key` = 'profile.logo.patient.NY45826';

UPDATE notification
SET type = REPLACE(type, 'NY45826', 'SY45826')
WHERE type LIKE '%NY45826%';
