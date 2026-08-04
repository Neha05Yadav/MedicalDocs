CREATE TABLE IF NOT EXISTS hospital_profile (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  hospitalId VARCHAR(191) NOT NULL UNIQUE,
  logoUrl VARCHAR(255) NULL,
  registrationNumber VARCHAR(191) NULL UNIQUE,
  establishedYear VARCHAR(10) NULL,
  emergencyContact VARCHAR(20) NULL,
  website VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  country VARCHAR(100) NULL,
  postalCode VARCHAR(20) NULL,
  adminName VARCHAR(100) NULL,
  adminDesignation VARCHAR(100) NULL,
  adminEmail VARCHAR(191) NULL,
  adminContact VARCHAR(20) NULL,
  departments TEXT NULL,
  description TEXT NULL,
  workingDays VARCHAR(100) NULL,
  openingTime VARCHAR(20) NULL,
  closingTime VARCHAR(20) NULL,
  emergencyServices BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_hospital_profile_hospital
    FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS clinic_patient (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  doctorId VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  age INT NULL,
  gender VARCHAR(191) NULL,
  bloodGroup VARCHAR(191) NULL,
  lastVisit VARCHAR(191) NULL,
  diagnosis VARCHAR(255) NULL,
  followUp VARCHAR(191) NULL,
  status VARCHAR(191) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_clinic_patient_doctor (doctorId),
  CONSTRAINT fk_clinic_patient_doctor
    FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS support_ticket (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  ticketId VARCHAR(50) NOT NULL UNIQUE,
  userId VARCHAR(191) NOT NULL,
  userName VARCHAR(100) NOT NULL,
  userRole VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  attachment VARCHAR(255) NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_support_ticket_user (userId),
  INDEX idx_support_ticket_status (status),
  INDEX idx_support_ticket_updated (updatedAt)
);

CREATE TABLE IF NOT EXISTS support_ticket_details (
  ticketId VARCHAR(36) NOT NULL PRIMARY KEY,
  assignedTo VARCHAR(100) NULL,
  internalNotes TEXT NULL,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_support_ticket_details_ticket
    FOREIGN KEY (ticketId) REFERENCES support_ticket(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS support_ticket_reply (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  ticketId VARCHAR(36) NOT NULL,
  senderId VARCHAR(191) NOT NULL,
  senderName VARCHAR(100) NOT NULL,
  senderRole VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_support_ticket_reply_ticket (ticketId),
  CONSTRAINT fk_support_ticket_reply_ticket
    FOREIGN KEY (ticketId) REFERENCES support_ticket(id) ON DELETE CASCADE ON UPDATE CASCADE
);
