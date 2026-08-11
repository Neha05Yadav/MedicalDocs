CREATE TABLE IF NOT EXISTS pharmacy_prescription_request (
  id VARCHAR(191) PRIMARY KEY,
  requestGroupId VARCHAR(191) NOT NULL,
  patientId VARCHAR(191) NOT NULL,
  pharmacyId VARCHAR(191) NOT NULL,
  prescriptionReference VARCHAR(191) NOT NULL,
  deliveryAddress TEXT NOT NULL,
  requestNote TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_pharmacy_request_recipient (pharmacyId, status, createdAt),
  INDEX idx_pharmacy_request_patient (patientId, createdAt),
  INDEX idx_pharmacy_request_group (requestGroupId),
  CONSTRAINT fk_pharmacy_request_patient
    FOREIGN KEY (patientId) REFERENCES patient(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pharmacy_request_facility
    FOREIGN KEY (pharmacyId) REFERENCES hospital(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
