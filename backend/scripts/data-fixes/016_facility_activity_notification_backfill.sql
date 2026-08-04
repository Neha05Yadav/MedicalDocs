INSERT IGNORE INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('facility-appointment-', a.id),
  a.hospitalId,
  'APPOINTMENT',
  CONCAT('Appointment ', LOWER(a.status)),
  LEFT(CONCAT(p.name, ' has an appointment with ', d.name, '. Status: ', a.status, '.'), 191),
  0,
  CASE WHEN UPPER(a.status) = 'SCHEDULED' THEN 1 ELSE 0 END,
  'Low',
  COALESCE(a.createdAt, a.dateTime),
  COALESCE(a.updatedAt, a.createdAt)
FROM appointment a
INNER JOIN patient p ON p.id = a.patientId
INNER JOIN doctor d ON d.id = a.doctorId;

INSERT IGNORE INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('facility-record-', m.hospitalId, '-', m.id),
  m.hospitalId,
  'REPORT',
  'Patient record available',
  LEFT(CONCAT(m.title, ' is available for ', p.name, '.'), 191),
  0,
  0,
  'Low',
  COALESCE(m.date, m.createdAt),
  COALESCE(m.updatedAt, m.createdAt)
FROM medicalrecord m
INNER JOIN patient p ON p.id = m.patientId
WHERE m.hospitalId IS NOT NULL;

INSERT IGNORE INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('facility-invoice-', i.id),
  i.hospitalId,
  'INVOICE',
  CONCAT('Invoice ', LOWER(i.status)),
  LEFT(CONCAT('Invoice ', i.id, ' for ', p.name, ' is ', i.status, ' (₹', FORMAT(i.totalAmount, 2), ').'), 191),
  0,
  CASE WHEN UPPER(i.status) = 'PENDING' THEN 1 ELSE 0 END,
  CASE WHEN UPPER(i.status) = 'PENDING' THEN 'Medium' ELSE 'Low' END,
  COALESCE(i.date, i.createdAt),
  COALESCE(i.updatedAt, i.createdAt)
FROM invoice i
INNER JOIN patient p ON p.id = i.patientId;

INSERT IGNORE INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('facility-lab-test-', tr.hospitalId, '-', tr.id),
  tr.hospitalId,
  'LAB_TEST',
  CONCAT('Lab test ', LOWER(tr.status)),
  LEFT(CONCAT(tr.testType, ' for ', p.name, ' is ', tr.status, '.'), 191),
  0,
  CASE WHEN UPPER(tr.status) = 'PENDING' THEN 1 ELSE 0 END,
  CASE WHEN UPPER(tr.priority) = 'URGENT' THEN 'High' ELSE 'Low' END,
  tr.createdAt,
  tr.updatedAt
FROM testrequest tr
INNER JOIN patient p ON p.id = tr.patientId
WHERE tr.hospitalId IS NOT NULL;

INSERT IGNORE INTO notification
  (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('referring-lab-test-', tr.referringHospitalId, '-', tr.id),
  tr.referringHospitalId,
  'LAB_TEST',
  CONCAT('Referred lab test ', LOWER(tr.status)),
  LEFT(CONCAT(tr.testType, ' for ', p.name, ' is ', tr.status, ' at the connected laboratory.'), 191),
  0,
  CASE WHEN UPPER(tr.status) = 'PENDING' THEN 1 ELSE 0 END,
  CASE WHEN UPPER(tr.priority) = 'URGENT' THEN 'High' ELSE 'Low' END,
  tr.createdAt,
  tr.updatedAt
FROM testrequest tr
INNER JOIN patient p ON p.id = tr.patientId
WHERE tr.referringHospitalId IS NOT NULL;
