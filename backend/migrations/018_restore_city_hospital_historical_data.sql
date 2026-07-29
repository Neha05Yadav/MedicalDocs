-- Restore the City Hospital (CH65526) ownership confirmed from MySQL binlogs.
UPDATE doctor
SET hospitalId = 'CH65526', updatedAt = NOW(3)
WHERE id IN (
  '15739f11-69a0-44a0-80b2-89716d3257b3',
  '37c23dea-95a3-42d9-b03a-1879495c711a',
  '525a24d4-d37e-4efa-b381-e7e9e067a6c9',
  '7a65222d-8704-422d-b0c2-e881ede6ef65',
  '88767a9b-f0fe-4fed-8fe1-315dda5da163',
  'a8cddec7-d5a1-4236-9c20-ce91eb14b21b',
  'b2a96f94-7178-449b-a39e-3f4478258f21',
  'c0155e65-368c-43dc-ab5b-e415be4028ff',
  'c682216e-ac2d-4525-b647-ecc233c273d1',
  'd6e44b24-f8cd-44b2-b7bd-5ea4f49a5883'
);

INSERT INTO doctor
  (id, name, specialization, phone, email, hospitalId, createdAt, updatedAt,
   status, department, experience, registrationNo, shift)
VALUES
  ('DOC-1783579332583-1', 'Dr. Vinod', 'Cardiology', '+91 9911111111',
   'vinod@apollo.com', 'CH65526', '2026-07-09 12:12:12.588',
   '2026-07-20 15:22:55.964', 'Active', 'Cardiology', '10 Years',
   'MCI-9901', '10:00 AM - 02:00 PM')
ON DUPLICATE KEY UPDATE
  hospitalId = VALUES(hospitalId),
  updatedAt = VALUES(updatedAt),
  shift = VALUES(shift);

INSERT INTO patient
  (id, name, phone, email, bloodGroup, gender, createdAt, updatedAt)
VALUES
  ('RK001261', 'Rajesh Kumar', '+91 9900000001', NULL, 'O+', 'Male',
   '2026-07-09 12:12:12.568', '2026-07-09 12:12:12.575'),
  ('SS002261', 'Sunita Sharma', '+91 9900000002', NULL, 'A+', 'Female',
   '2026-07-09 12:12:12.579', '2026-07-09 12:12:12.584')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  phone = VALUES(phone),
  bloodGroup = VALUES(bloodGroup),
  gender = VALUES(gender);

UPDATE accessrequest
SET hospitalId = 'CH65526', updatedAt = NOW(3)
WHERE id IN (
  '027c8c64-76e5-4b52-8316-724916d7ea3a',
  '19bb8ae6-91c0-4cea-a756-5c7234b7daae',
  '311b8b15-8cfd-419c-8107-c6da578a60cc',
  '420babd1-44b0-44b0-96fd-353b7ad7dc49',
  '5e0257f1-2b7a-4823-84c7-936aa70e7c80',
  '8fd2476f-0207-4382-9ab7-6771df55f54b',
  'd4853170-7b78-4ab8-9889-46913d3f5941',
  'ffe4ce4b-3965-43bc-8dc4-1e4f3a78ba06'
);

INSERT INTO accessrequest
  (id, patientId, doctorId, hospitalId, status, requestDate, createdAt, updatedAt)
VALUES
  ('REQ-1783579332588-1', 'RK001261', 'DOC-1783579332583-1', 'CH65526',
   'APPROVED', '2026-07-09 12:12:12.588', '2026-07-09 12:12:12.588',
   '2026-07-09 12:12:12.588'),
  ('REQ-1783579332597-2', 'SS002261', 'DOC-1783579332583-1', 'CH65526',
   'APPROVED', '2026-07-09 12:12:12.597', '2026-07-09 12:12:12.597',
   '2026-07-09 12:12:12.597')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  doctorId = VALUES(doctorId),
  hospitalId = VALUES(hospitalId),
  status = VALUES(status);

INSERT INTO medicalrecord
  (id, patientId, title, description, fileUrl, date, type, createdAt, updatedAt,
   hospitalId, status)
VALUES
  ('2d0df4f1-5288-4911-bb83-d00d2ce7ce49', 'NY60226', 'Urine Test', NULL,
   'f0675af3a768aab1e0507ab364ab830e', '2026-07-08 17:19:12.775', 'Other',
   '2026-07-08 17:19:12.775', '2026-07-08 17:19:12.785', 'CH65526', 'Available'),
  ('be19fa97-3432-474d-bd3f-9ffefaa693a8', 'NY60226', 'Lipid Profile Report',
   NULL, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
   '2026-07-08 17:07:15.779', 'Other', '2026-07-08 17:07:15.779',
   '2026-07-08 17:07:15.783', 'CH65526', 'Available'),
  ('REC-1783579332601-1', 'RK001261', 'Checkup', 'Routine check', NULL,
   '2026-07-09 12:12:12.601', 'CLINICAL_NOTE', '2026-07-09 12:12:12.601',
   '2026-07-09 12:12:12.605', 'CH65526', 'Available'),
  ('fc57962c-8280-4518-abfb-76f6ed44a8c1', 'NY60226', 'Blood Test',
   'From Lab: Lab Report', NULL, '2026-07-10 10:31:08.942', 'LAB_REPORT',
   '2026-07-10 10:31:08.942', '2026-07-10 10:31:08.942', 'CH65526', 'Available')
ON DUPLICATE KEY UPDATE
  patientId = VALUES(patientId),
  hospitalId = VALUES(hospitalId),
  title = VALUES(title),
  type = VALUES(type),
  status = VALUES(status);
