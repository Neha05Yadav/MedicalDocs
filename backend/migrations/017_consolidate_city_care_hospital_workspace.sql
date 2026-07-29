-- Consolidate the two legacy City Care Hospital tenants that share the same
-- authoritative email/name into the original data-rich workspace.
UPDATE user
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE LOWER(email) = 'hospital@demo.com';

UPDATE doctor
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE appointment
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE medicalrecord
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE invoice
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE accessrequest
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE testrequest
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE testrequest
SET referringHospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE referringHospitalId = 'hosp-1';

UPDATE notification
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';

UPDATE hospitalsubscription
SET hospitalId = 'e9012a1b-d09a-4086-8685-d91ef752a2e7', updatedAt = NOW(3)
WHERE hospitalId = 'hosp-1';
