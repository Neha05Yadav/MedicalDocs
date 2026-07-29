-- Restore Suhana Yadav's account and records from the original MySQL row history.
-- Every write is idempotent so this migration can safely be re-run.

INSERT INTO hospital
  (id, name, address, phone, email, createdAt, updatedAt, status, isVerified, licenseNumber, type)
VALUES
  ('CH65526', 'City Hospital', 'Sector 14, Gurugram', '+91 9988776655',
   'Hospital456@gmail.com', '2026-07-01 11:27:04.443',
   '2026-07-20 15:08:40.201', 'Active', 1, NULL, 'HOSPITAL'),
  ('AP0001', 'Apex Lab', 'Not provided', 'Not provided',
   'Apex123@gmail.com', '2026-07-01 11:27:04.443',
   '2026-07-23 15:31:05.112', 'Active', 1, NULL, 'LAB')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  address = VALUES(address),
  phone = VALUES(phone),
  email = VALUES(email),
  updatedAt = VALUES(updatedAt),
  status = VALUES(status),
  isVerified = VALUES(isVerified),
  type = VALUES(type);

UPDATE patient
SET id = 'SY13926',
    name = 'Suhana Yadav',
    phone = '6399785578',
    dateOfBirth = '2002-10-20 05:30:00.000',
    bloodGroup = 'O+',
    gender = 'Female',
    createdAt = '2026-07-22 16:59:39.000',
    updatedAt = '2026-07-23 16:39:28.905'
WHERE LOWER(email) = 'yadav789@gmail.com';

UPDATE user
SET name = 'Suhana Yadav',
    phone = '6399785578',
    updatedAt = '2026-07-23 16:39:28.905'
WHERE LOWER(email) = 'yadav789@gmail.com'
  AND UPPER(role) = 'PATIENT';

UPDATE doctor
SET hospitalId = 'CH65526'
WHERE id = '15739f11-69a0-44a0-80b2-89716d3257b3';

INSERT INTO medicalrecord
  (id, patientId, title, description, fileUrl, date, type, createdAt, updatedAt, hospitalId, status)
VALUES
  ('a207972e-bf77-47ce-894c-098bfeece045', 'SY13926', 'Sugar Test Report ', NULL,
   'report-1784720826344-661144186.png', '2026-07-22 17:17:06.361', 'Other',
   '2026-07-22 17:17:06.365', '2026-07-22 17:17:06.361', NULL, 'Available'),
  ('9fe9b235-ed4b-4111-a1e8-641d52234e42', 'SY13926', 'Blood test', NULL,
   'report-1784783912279-506403388.jpg', '2026-07-23 10:48:32.294', 'Blood Test',
   '2026-07-23 10:48:32.296', '2026-07-23 10:48:32.294', NULL, 'Available'),
  ('9f63f54d-31a2-41bb-84b1-0beb0a8b86b7', 'SY13926', 'Liver Function Test (LFT)', NULL,
   'report-1784787709570-325641838.png', '2026-07-23 11:51:49.622', 'Lab Report',
   '2026-07-23 11:51:49.627', '2026-07-23 11:51:49.622', 'clinic-1', 'Available'),
  ('66f81fe6-7d50-471c-98d9-9a3491f516e2', 'SY13926', 'Blood Test Report', 'Blood Test',
   'report-1784797814714-123269971.jpg', '2026-07-23 14:40:14.742', 'LAB_REPORT',
   '2026-07-23 14:40:14.745', '2026-07-23 14:40:14.742', 'AP0001', 'Available'),
  ('52d7c359-358a-4474-84ed-b7e5de17c027', 'SY13926', 'Blood Test Report', 'From Apex Lab: Blood Test',
   'report-1784797814714-123269971.jpg', '2026-07-23 14:40:14.767', 'LAB_REPORT',
   '2026-07-23 14:40:14.768', '2026-07-23 14:40:14.767', 'clinic-1', 'Available'),
  ('b0361ce9-da77-4cbd-ac82-ef11f536f1a5', 'SY13926', 'Complete Blood Test Report', 'Complete Blood Test',
   'report-1784800865037-848507321.png', '2026-07-23 15:31:05.083', 'LAB_REPORT',
   '2026-07-23 15:31:05.087', '2026-07-23 15:31:05.083', 'AP0001', 'Available'),
  ('a890b937-cf1c-48a0-889d-24311bd84a2d', 'SY13926', 'Complete Blood Test Report',
   'From Apex Lab: Complete Blood Test', 'report-1784800865037-848507321.png',
   '2026-07-23 15:31:05.111', 'LAB_REPORT', '2026-07-23 15:31:05.112',
   '2026-07-23 15:31:05.111', 'CH65526', 'Available')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  title = VALUES(title),
  description = VALUES(description),
  fileUrl = VALUES(fileUrl),
  date = VALUES(date),
  type = VALUES(type),
  updatedAt = VALUES(updatedAt),
  hospitalId = VALUES(hospitalId),
  status = VALUES(status);

INSERT IGNORE INTO stored_file_medical_record (storedFileId, medicalRecordId, createdAt)
SELECT sf.id, mr.id, mr.createdAt
FROM medicalrecord mr
JOIN stored_file sf ON sf.relativePath = mr.fileUrl
WHERE mr.patientId = 'SY13926'
  AND mr.fileUrl IN (
    'report-1784720826344-661144186.png',
    'report-1784783912279-506403388.jpg',
    'report-1784787709570-325641838.png',
    'report-1784797814714-123269971.jpg',
    'report-1784800865037-848507321.png'
  );

INSERT INTO accessrequest
  (id, patientId, doctorId, hospitalId, status, requestDate, createdAt, updatedAt,
   admissionInfo, hospitalPatientMobile, hospitalPatientName, reportTypes, reason, priority, duration)
VALUES
  ('ffe4ce4b-3965-43bc-8dc4-1e4f3a78ba06', 'SY13926',
   '15739f11-69a0-44a0-80b2-89716d3257b3', 'CH65526', 'EXPIRED',
   '2026-07-22 17:17:42.457', '2026-07-22 17:17:42.457', '2026-07-22 17:18:07.918',
   NULL, NULL, NULL, 'Sugar Test Report', 'for treatment ', 'Normal', '24 Hours'),
  ('0921a61f-a660-404f-904b-7528d7a2d57a', 'SY13926', 'doc-2', 'clinic-1', 'APPROVED',
   '2026-07-23 11:13:55.999', '2026-07-23 10:39:53.323', '2026-07-23 11:15:16.339',
   NULL, NULL, NULL, 'Blood Test', 'For treatment ', 'Normal', 'Until Patient Revokes')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  doctorId = VALUES(doctorId),
  hospitalId = VALUES(hospitalId),
  status = VALUES(status),
  requestDate = VALUES(requestDate),
  updatedAt = VALUES(updatedAt),
  reportTypes = VALUES(reportTypes),
  reason = VALUES(reason),
  priority = VALUES(priority),
  duration = VALUES(duration);

INSERT INTO invoice
  (id, patientId, hospitalId, consultationFee, testFee, totalAmount, status, date, createdAt, updatedAt)
VALUES
  ('e7fd2567-c9a8-4195-b412-46485957c1a3', 'SY13926', 'CH65526',
   200, 149, 349, 'Pending', '2026-07-23 15:36:23.168',
   '2026-07-23 15:36:23.176', '2026-07-23 15:36:23.168'),
  ('18653b32-a4ba-46ab-8551-49d2a00c51d3', 'SY13926', 'CH65526',
   1000, 11000, 12000, 'Paid', '2026-07-23 15:39:40.447',
   '2026-07-23 15:39:40.449', '2026-07-23 15:39:40.447')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  hospitalId = VALUES(hospitalId),
  consultationFee = VALUES(consultationFee),
  testFee = VALUES(testFee),
  totalAmount = VALUES(totalAmount),
  status = VALUES(status),
  updatedAt = VALUES(updatedAt);

INSERT INTO setting (`key`, value, updatedAt)
VALUES ('profile.logo.patient.SY13926',
        '/uploads/report-1784804968893-524525077.png',
        '2026-07-23 16:39:28.905')
ON DUPLICATE KEY UPDATE
  value = VALUES(value),
  updatedAt = VALUES(updatedAt);

INSERT INTO support_ticket
  (id, ticketId, userId, userName, userRole, category, subject, description,
   attachment, priority, status, createdAt, updatedAt)
VALUES
  ('3ca5d0d7-43a0-40ac-9531-6edc0518c1e7', 'SUP-2026-0723-0001',
   'SY13926', 'Suhana Yadav', 'Patient', 'Bug Report',
   'Unable to Generate Hospital Invoice',
   'I am unable to create a hospital invoice. After filling the billing details and clicking the Create Bill button, the system displays the error message "Add valid itemized charges" even though the billing process has been initiated. Please investigate and resolve this issue as soon as possible.',
   NULL, 'Medium', 'Open', '2026-07-23 17:12:42', '2026-07-23 17:12:42')
ON DUPLICATE KEY UPDATE
  userId = VALUES(userId),
  userName = VALUES(userName),
  userRole = VALUES(userRole),
  category = VALUES(category),
  subject = VALUES(subject),
  description = VALUES(description),
  priority = VALUES(priority),
  status = VALUES(status),
  updatedAt = VALUES(updatedAt);
