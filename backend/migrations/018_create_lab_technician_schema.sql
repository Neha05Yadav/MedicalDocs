CREATE TABLE IF NOT EXISTS labtechnician (
  id VARCHAR(191) PRIMARY KEY,
  technicianCode VARCHAR(40) NOT NULL UNIQUE,
  hospitalId VARCHAR(191) NOT NULL,
  fullName VARCHAR(191) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(191) NOT NULL,
  qualification VARCHAR(191) NOT NULL,
  specialization VARCHAR(191) NOT NULL,
  experienceYears DECIMAL(5,1) NOT NULL DEFAULT 0,
  availabilityStatus VARCHAR(30) NOT NULL DEFAULT 'Available',
  joiningDate DATE NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  deletedAt DATETIME(3) NULL,
  UNIQUE KEY uq_labtechnician_hospital_email (hospitalId, email),
  INDEX idx_labtechnician_hospital_status (hospitalId, availabilityStatus),
  CONSTRAINT fk_labtechnician_hospital FOREIGN KEY (hospitalId) REFERENCES hospital(id) ON DELETE CASCADE
);

ALTER TABLE testrequest
  ADD COLUMN IF NOT EXISTS assignedTechnicianId VARCHAR(191) NULL AFTER assignedTo;
