CREATE TABLE IF NOT EXISTS hospital (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NULL UNIQUE,
  phone VARCHAR(40) NULL,
  address TEXT NULL,
  licenseNumber VARCHAR(100) NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'HOSPITAL',
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  isVerified TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_hospital_type_status (type, status)
);

CREATE TABLE IF NOT EXISTS user (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(191) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  hospitalId VARCHAR(191) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_user_role_status (role, status),
  INDEX idx_user_hospital (hospitalId),
  CONSTRAINT fk_user_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS patient (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NULL UNIQUE,
  phone VARCHAR(40) NULL,
  gender VARCHAR(30) NULL,
  dateOfBirth DATE NULL,
  bloodGroup VARCHAR(10) NULL,
  address TEXT NULL,
  emergencyContact VARCHAR(80) NULL,
  allergies TEXT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_patient_phone (phone),
  INDEX idx_patient_name (name)
);

CREATE TABLE IF NOT EXISTS doctor (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NULL,
  phone VARCHAR(40) NULL,
  hospitalId VARCHAR(191) NOT NULL,
  specialization VARCHAR(120) NULL,
  department VARCHAR(120) NULL,
  registrationNo VARCHAR(100) NULL,
  experience VARCHAR(80) NULL,
  shift VARCHAR(80) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  consultationFee DECIMAL(12,2) NOT NULL DEFAULT 0,
  slotDurationMinutes INT NOT NULL DEFAULT 30,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_doctor_facility_status (hospitalId, status),
  INDEX idx_doctor_email (email),
  CONSTRAINT fk_doctor_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_availability (
  id VARCHAR(191) PRIMARY KEY,
  doctorId VARCHAR(191) NOT NULL,
  weekday TINYINT NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  slotDurationMinutes INT NOT NULL DEFAULT 30,
  active TINYINT(1) NOT NULL DEFAULT 1,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_doctor_availability (doctorId, weekday, startTime),
  CONSTRAINT fk_availability_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_time_off (
  id VARCHAR(191) PRIMARY KEY,
  doctorId VARCHAR(191) NOT NULL,
  startsAt DATETIME(3) NOT NULL,
  endsAt DATETIME(3) NOT NULL,
  reason VARCHAR(255) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_time_off_doctor (doctorId, startsAt, endsAt),
  CONSTRAINT fk_time_off_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointment (
  id VARCHAR(191) PRIMARY KEY,
  patientId VARCHAR(191) NOT NULL,
  doctorId VARCHAR(191) NOT NULL,
  hospitalId VARCHAR(191) NOT NULL,
  dateTime DATETIME(3) NOT NULL,
  endTime DATETIME(3) NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'OPD',
  status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT NULL,
  reason TEXT NULL,
  consultationFee DECIMAL(12,2) NOT NULL DEFAULT 0,
  invoiceId VARCHAR(191) NULL,
  checkedInAt DATETIME(3) NULL,
  completedAt DATETIME(3) NULL,
  cancelledAt DATETIME(3) NULL,
  cancellationReason TEXT NULL,
  rescheduledFromId VARCHAR(191) NULL,
  reminderSentAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_appointment_patient (patientId, dateTime),
  INDEX idx_appointment_doctor_slot (doctorId, dateTime, status),
  INDEX idx_appointment_facility (hospitalId, dateTime),
  CONSTRAINT fk_appointment_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointment_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS medicalrecord (
  id VARCHAR(191) PRIMARY KEY,
  patientId VARCHAR(191) NOT NULL,
  hospitalId VARCHAR(191) NULL,
  doctorId VARCHAR(191) NULL,
  title VARCHAR(191) NOT NULL,
  category VARCHAR(100) NULL,
  description TEXT NULL,
  type VARCHAR(50) NOT NULL,
  fileUrl TEXT NULL,
  fileName VARCHAR(255) NULL,
  fileSize BIGINT NULL,
  mimeType VARCHAR(100) NULL,
  date DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_record_patient_date (patientId, date),
  INDEX idx_record_facility_type (hospitalId, type),
  CONSTRAINT fk_record_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE CASCADE,
  CONSTRAINT fk_record_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE SET NULL,
  CONSTRAINT fk_record_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prescription (
  id VARCHAR(191) PRIMARY KEY,
  prescriptionId VARCHAR(50) NULL UNIQUE,
  patientId VARCHAR(191) NOT NULL,
  doctorId VARCHAR(191) NULL,
  hospitalId VARCHAR(191) NULL,
  appointmentId VARCHAR(191) NULL,
  medicine TEXT NULL,
  dosage TEXT NULL,
  duration VARCHAR(120) NULL,
  instructions TEXT NULL,
  diagnosis TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  fileUrl TEXT NULL,
  date DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  INDEX idx_prescription_patient (patientId, createdAt),
  INDEX idx_prescription_doctor (doctorId, createdAt),
  CONSTRAINT fk_prescription_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE CASCADE,
  CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE SET NULL,
  CONSTRAINT fk_prescription_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE SET NULL,
  CONSTRAINT fk_prescription_appointment FOREIGN KEY (appointmentId) REFERENCES appointment(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS accessrequest (
  id VARCHAR(191) PRIMARY KEY,
  patientId VARCHAR(191) NOT NULL,
  doctorId VARCHAR(191) NULL,
  hospitalId VARCHAR(191) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  reportTypes TEXT NULL,
  reason TEXT NULL,
  priority VARCHAR(30) NULL,
  duration VARCHAR(80) NULL,
  note TEXT NULL,
  admissionInfo TEXT NULL,
  hospitalPatientName VARCHAR(191) NULL,
  hospitalPatientMobile VARCHAR(40) NULL,
  requestDate DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_access_patient (patientId, status),
  INDEX idx_access_facility (hospitalId, status),
  CONSTRAINT fk_access_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE CASCADE,
  CONSTRAINT fk_access_doctor FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE SET NULL,
  CONSTRAINT fk_access_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NULL,
  hospitalId VARCHAR(191) NULL,
  type VARCHAR(80) NOT NULL,
  title VARCHAR(191) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(30) NULL,
  isRead TINYINT(1) NOT NULL DEFAULT 0,
  actionRequired TINYINT(1) NOT NULL DEFAULT 0,
  actionUrl TEXT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_notification_user (userId, isRead, createdAt),
  INDEX idx_notification_facility (hospitalId, isRead, createdAt),
  CONSTRAINT fk_notification_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoice (
  id VARCHAR(191) PRIMARY KEY,
  patientId VARCHAR(191) NULL,
  hospitalId VARCHAR(191) NULL,
  consultationFee DECIMAL(12,2) NOT NULL DEFAULT 0,
  testFee DECIMAL(12,2) NOT NULL DEFAULT 0,
  totalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  date DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_legacy_invoice_patient (patientId, date),
  INDEX idx_legacy_invoice_facility (hospitalId, date),
  CONSTRAINT fk_legacy_invoice_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE SET NULL,
  CONSTRAINT fk_legacy_invoice_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payment (
  id VARCHAR(191) PRIMARY KEY,
  invoiceId VARCHAR(191) NOT NULL,
  patientId VARCHAR(191) NOT NULL,
  facilityId VARCHAR(191) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  method VARCHAR(40) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  transactionId VARCHAR(191) NULL UNIQUE,
  reference VARCHAR(191) NULL,
  paidAt DATETIME(3) NULL,
  refundedAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_payment_invoice (invoiceId, createdAt),
  INDEX idx_payment_facility (facilityId, status, createdAt),
  CONSTRAINT fk_payment_patient FOREIGN KEY (patientId) REFERENCES patient(id) ON DELETE RESTRICT,
  CONSTRAINT fk_payment_facility FOREIGN KEY (facilityId) REFERENCES hospital(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NULL,
  user_email VARCHAR(191) NULL,
  action_type VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entityId VARCHAR(191) NULL,
  details TEXT NULL,
  ip_address VARCHAR(80) NULL,
  beforeData JSON NULL,
  afterData JSON NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_audit_entity (entity_type, entityId, createdAt),
  INDEX idx_audit_user (userId, createdAt)
);

CREATE TABLE IF NOT EXISTS setting (
  `key` VARCHAR(191) PRIMARY KEY,
  value TEXT NULL,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS prescription_id_sequence (
  sequenceName VARCHAR(50) PRIMARY KEY,
  nextValue BIGINT NOT NULL DEFAULT 1,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

INSERT IGNORE INTO prescription_id_sequence (sequenceName, nextValue) VALUES ('prescription', 1);
