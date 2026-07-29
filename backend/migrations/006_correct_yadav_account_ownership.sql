UPDATE patient
SET id = 'NY45826',
    name = 'Neha Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE id = 'SY45826'
  AND LOWER(email) = 'yadav123@gmail.com';

UPDATE user
SET name = 'Neha Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) = 'yadav123@gmail.com'
  AND UPPER(role) = 'PATIENT';

UPDATE accessrequest SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE appointment SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE invoice SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE medicalrecord SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE prescription SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE sample SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE testrequest SET patientId = 'NY45826' WHERE patientId = 'SY45826';
UPDATE setting
SET `key` = 'profile.logo.patient.NY45826'
WHERE `key` = 'profile.logo.patient.SY45826';
UPDATE notification
SET type = REPLACE(type, 'SY45826', 'NY45826')
WHERE type LIKE '%SY45826%';

UPDATE patient
SET id = 'SY55326',
    name = 'Suhana Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE id = 'NY55326'
  AND LOWER(email) = 'yadav789@gmail.com';

UPDATE user
SET name = 'Suhana Yadav',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) = 'yadav789@gmail.com'
  AND UPPER(role) = 'PATIENT';

UPDATE accessrequest SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE appointment SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE invoice SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE medicalrecord SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE prescription SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE sample SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE testrequest SET patientId = 'SY55326' WHERE patientId = 'NY55326';
UPDATE setting
SET `key` = 'profile.logo.patient.SY55326'
WHERE `key` = 'profile.logo.patient.NY55326';
UPDATE notification
SET type = REPLACE(type, 'NY55326', 'SY55326')
WHERE type LIKE '%NY55326%';
