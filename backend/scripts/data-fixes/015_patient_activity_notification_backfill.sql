INSERT IGNORE INTO notification
  (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('patient-record-', m.id),
  u.id,
  'REPORT',
  'Health record available',
  LEFT(CONCAT(COALESCE(h.name, 'Your healthcare provider'), ' added ', m.title, ' to your health records.'), 191),
  0,
  0,
  'Low',
  COALESCE(m.date, m.createdAt),
  COALESCE(m.updatedAt, m.createdAt)
FROM medicalrecord m
INNER JOIN patient p ON p.id = m.patientId
INNER JOIN user u ON LOWER(u.email) = LOWER(p.email)
LEFT JOIN hospital h ON h.id = m.hospitalId;

INSERT IGNORE INTO notification
  (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('patient-access-', ar.id),
  u.id,
  'ACCESS_REQUEST',
  CONCAT('Record access request: ', ar.status),
  LEFT(CONCAT(COALESCE(h.name, 'A healthcare provider'), ' requested access to your medical records. Status: ', ar.status, '.'), 191),
  0,
  CASE WHEN UPPER(ar.status) = 'PENDING' THEN 1 ELSE 0 END,
  CASE WHEN UPPER(ar.status) = 'PENDING' THEN 'Medium' ELSE 'Low' END,
  COALESCE(ar.requestDate, ar.createdAt),
  COALESCE(ar.updatedAt, ar.createdAt)
FROM accessrequest ar
INNER JOIN patient p ON p.id = ar.patientId
INNER JOIN user u ON LOWER(u.email) = LOWER(p.email)
LEFT JOIN hospital h ON h.id = ar.hospitalId;

INSERT IGNORE INTO notification
  (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('patient-appointment-', a.id),
  u.id,
  'APPOINTMENT',
  CONCAT('Appointment ', LOWER(a.status)),
  LEFT(CONCAT('Your appointment with ', COALESCE(d.name, 'your doctor'), ' at ', COALESCE(h.name, 'the healthcare facility'), ' is ', LOWER(a.status), '.'), 191),
  0,
  0,
  'Low',
  COALESCE(a.createdAt, a.dateTime),
  COALESCE(a.updatedAt, a.createdAt)
FROM appointment a
INNER JOIN patient p ON p.id = a.patientId
INNER JOIN user u ON LOWER(u.email) = LOWER(p.email)
LEFT JOIN doctor d ON d.id = a.doctorId
LEFT JOIN hospital h ON h.id = a.hospitalId;

INSERT IGNORE INTO notification
  (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('patient-invoice-', i.id),
  u.id,
  'INVOICE',
  CONCAT('Invoice ', LOWER(i.status)),
  LEFT(CONCAT(COALESCE(h.name, 'Your healthcare provider'), ' issued invoice ', i.id, ' for ₹', FORMAT(i.totalAmount, 2), '. Status: ', i.status, '.'), 191),
  0,
  CASE WHEN UPPER(i.status) = 'PENDING' THEN 1 ELSE 0 END,
  CASE WHEN UPPER(i.status) = 'PENDING' THEN 'Medium' ELSE 'Low' END,
  COALESCE(i.date, i.createdAt),
  COALESCE(i.updatedAt, i.createdAt)
FROM invoice i
INNER JOIN patient p ON p.id = i.patientId
INNER JOIN user u ON LOWER(u.email) = LOWER(p.email)
LEFT JOIN hospital h ON h.id = i.hospitalId;

INSERT IGNORE INTO notification
  (id, userId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt)
SELECT
  CONCAT('patient-test-', tr.id),
  u.id,
  'LAB_TEST',
  CONCAT('Lab test ', LOWER(tr.status)),
  LEFT(CONCAT(tr.testType, ' is ', LOWER(tr.status), ' at ', COALESCE(h.name, 'the laboratory'), '.'), 191),
  0,
  0,
  CASE WHEN UPPER(tr.priority) = 'URGENT' THEN 'High' ELSE 'Low' END,
  tr.createdAt,
  tr.updatedAt
FROM testrequest tr
INNER JOIN patient p ON p.id = tr.patientId
INNER JOIN user u ON LOWER(u.email) = LOWER(p.email)
LEFT JOIN hospital h ON h.id = tr.hospitalId;
