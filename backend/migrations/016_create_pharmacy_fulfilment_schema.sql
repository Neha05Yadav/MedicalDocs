CREATE TABLE IF NOT EXISTS pharmacy_inventory_item (
  id VARCHAR(191) PRIMARY KEY,
  pharmacyId VARCHAR(191) NOT NULL,
  medicineName VARCHAR(191) NOT NULL,
  batchNumber VARCHAR(100) NULL,
  stockQuantity INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(12,2) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_pharmacy_inventory_lookup (pharmacyId, medicineName, active),
  CONSTRAINT fk_pharmacy_inventory_facility
    FOREIGN KEY (pharmacyId) REFERENCES hospital(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS pharmacy_quotation (
  id VARCHAR(191) PRIMARY KEY,
  requestId VARCHAR(191) NOT NULL,
  requestGroupId VARCHAR(191) NOT NULL,
  patientId VARCHAR(191) NOT NULL,
  pharmacyId VARCHAR(191) NOT NULL,
  itemsJson JSON NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  discountAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
  taxAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deliveryCharge DECIMAL(12,2) NOT NULL DEFAULT 0,
  totalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  validUntil DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_pharmacy_quotation_request (requestId),
  INDEX idx_pharmacy_quotation_patient (patientId, status, createdAt),
  INDEX idx_pharmacy_quotation_facility (pharmacyId, status, createdAt),
  CONSTRAINT fk_pharmacy_quotation_request
    FOREIGN KEY (requestId) REFERENCES pharmacy_prescription_request(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pharmacy_quotation_patient
    FOREIGN KEY (patientId) REFERENCES patient(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pharmacy_quotation_facility
    FOREIGN KEY (pharmacyId) REFERENCES hospital(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS pharmacy_order (
  id VARCHAR(191) PRIMARY KEY,
  quotationId VARCHAR(191) NOT NULL,
  requestGroupId VARCHAR(191) NOT NULL,
  patientId VARCHAR(191) NOT NULL,
  pharmacyId VARCHAR(191) NOT NULL,
  totalAmount DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_pharmacy_order_quotation (quotationId),
  INDEX idx_pharmacy_order_patient (patientId, status, createdAt),
  INDEX idx_pharmacy_order_facility (pharmacyId, status, createdAt),
  CONSTRAINT fk_pharmacy_order_quotation
    FOREIGN KEY (quotationId) REFERENCES pharmacy_quotation(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pharmacy_order_patient
    FOREIGN KEY (patientId) REFERENCES patient(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pharmacy_order_facility
    FOREIGN KEY (pharmacyId) REFERENCES hospital(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
