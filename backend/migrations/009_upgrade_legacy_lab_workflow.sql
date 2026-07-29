-- 002 creates the clinical tables for a new database, but legacy installations
-- already had testrequest/sample tables. Upgrade those tables in place so the
-- workflow API can use the same schema without replacing any existing rows.

ALTER TABLE testrequest
  ADD COLUMN catalogTestId VARCHAR(191) NULL AFTER referringHospitalId,
  ADD COLUMN packageId VARCHAR(191) NULL AFTER catalogTestId,
  ADD COLUMN sampleId VARCHAR(80) NULL AFTER priority,
  ADD COLUMN sampleCollectedAt DATETIME(3) NULL AFTER sampleId,
  ADD COLUMN assignedTo VARCHAR(191) NULL AFTER sampleCollectedAt,
  ADD COLUMN rejectionReason TEXT NULL AFTER assignedTo,
  ADD COLUMN homeCollection TINYINT(1) NOT NULL DEFAULT 0 AFTER rejectionReason,
  ADD COLUMN collectionAddress TEXT NULL AFTER homeCollection,
  ADD COLUMN preparationInstructions TEXT NULL AFTER collectionAddress,
  ADD COLUMN unitPrice DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER preparationInstructions,
  ADD COLUMN homeCollectionCharge DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER unitPrice,
  ADD COLUMN abnormalFlag VARCHAR(30) NULL AFTER homeCollectionCharge,
  ADD COLUMN clinicalNotes TEXT NULL AFTER abnormalFlag,
  ADD COLUMN invoiceId VARCHAR(191) NULL AFTER clinicalNotes,
  ADD COLUMN reportRecordId VARCHAR(191) NULL AFTER invoiceId;

ALTER TABLE sample
  MODIFY COLUMN testRequestId VARCHAR(191) NULL,
  MODIFY COLUMN hospitalId VARCHAR(191) NULL,
  ADD COLUMN barcodeValue VARCHAR(191) NULL AFTER hospitalId,
  ADD COLUMN collectedAt DATETIME(3) NULL AFTER barcodeValue,
  ADD COLUMN receivedAt DATETIME(3) NULL AFTER collectedAt,
  ADD COLUMN processedAt DATETIME(3) NULL AFTER receivedAt,
  ADD COLUMN disposedAt DATETIME(3) NULL AFTER processedAt,
  ADD COLUMN temperature VARCHAR(40) NULL AFTER disposedAt,
  ADD COLUMN containerType VARCHAR(80) NULL AFTER temperature,
  ADD COLUMN rejectionReason TEXT NULL AFTER containerType,
  ADD COLUMN assignedTo VARCHAR(191) NULL AFTER rejectionReason;

UPDATE sample
SET barcodeValue = CONCAT('SMP-', UPPER(LEFT(REPLACE(id, '-', ''), 12)))
WHERE barcodeValue IS NULL OR barcodeValue = '';

ALTER TABLE medicalrecord
  ADD COLUMN category VARCHAR(100) NULL AFTER type;
