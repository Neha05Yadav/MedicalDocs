-- Restore Neha Yadav's original patient identity from the historical database
-- and let the existing ON UPDATE CASCADE constraints reconnect clinical data.
UPDATE patient
SET id = 'NY45626', updatedAt = NOW(3)
WHERE id = 'NY60226'
  AND LOWER(email) = 'makejoh518@heavty.com'
  AND NOT EXISTS (
    SELECT 1
    FROM (SELECT id FROM patient) existing_patient
    WHERE existing_patient.id = 'NY45626'
  );

UPDATE notification
SET type = REPLACE(type, 'NY60226', 'NY45626'),
    message = REPLACE(message, 'NY60226', 'NY45626'),
    updatedAt = NOW(3)
WHERE type LIKE '%NY60226%'
   OR message LIKE '%NY60226%';

UPDATE setting
SET `key` = REPLACE(`key`, 'NY60226', 'NY45626'),
    updatedAt = NOW(3)
WHERE `key` LIKE '%NY60226%';
