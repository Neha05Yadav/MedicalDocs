-- Repair legacy account-to-facility ownership and restore real laboratory
-- requests recovered from the original MySQL row history.

UPDATE user
SET hospitalId = 'AP0001', updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) IN ('lab789@gmail.com', 'apex123@gmail.com');

UPDATE user
SET hospitalId = 'CH65526', updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) = 'hospital456@gmail.com';

INSERT INTO testrequest
  (id, patientId, hospitalId, testType, status, priority, createdAt, updatedAt,
   doctorId, referringHospitalId)
VALUES
  ('41a26acf-83c3-4012-981f-99cd4fbf2735', 'SY13926', 'AP0001',
   'Complete Blood test', 'Completed', 'Normal',
   '2026-07-23 12:53:58.423', '2026-07-23 14:27:11.895',
   'doc-2', 'clinic-1'),
  ('4e0ab048-642d-49e4-ae22-fb190dcf6d67', 'SY13926', 'AP0001',
   'Complete Blood Test', 'Completed', 'Normal',
   '2026-07-23 15:30:00.613', '2026-07-23 15:31:05.105',
   '7a65222d-8704-422d-b0c2-e881ede6ef65', 'CH65526')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  hospitalId = VALUES(hospitalId),
  testType = VALUES(testType),
  status = VALUES(status),
  priority = VALUES(priority),
  updatedAt = VALUES(updatedAt),
  doctorId = VALUES(doctorId),
  referringHospitalId = VALUES(referringHospitalId);

INSERT INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired,
   createdAt, updatedAt, severity)
VALUES
  ('d98a6b0a-30a9-40f6-90fd-3af346f56403', 'AP0001',
   'LAB_REQUEST|clinic-1', 'New Lab Request',
   'Green Valley Clinic has requested a Complete Blood test for patient SY13926.',
   1, 1, '2026-07-23 12:53:58.432', '2026-07-23 12:53:58.432', 'High'),
  ('484c4cc9-a3b7-4c99-831d-133cce83dec7', 'AP0001',
   'LAB_REQUEST|CH65526', 'New Lab Request',
   'City Hospital has requested a Complete Blood Test for patient SY13926.',
   1, 1, '2026-07-23 15:30:00.648', '2026-07-23 15:30:00.648', 'High')
ON DUPLICATE KEY UPDATE
  hospitalId = VALUES(hospitalId),
  type = VALUES(type),
  title = VALUES(title),
  message = VALUES(message),
  isRead = VALUES(isRead),
  actionRequired = VALUES(actionRequired),
  updatedAt = VALUES(updatedAt),
  severity = VALUES(severity);
