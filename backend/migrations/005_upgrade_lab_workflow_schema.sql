-- Structural compatibility for installations whose laboratory workflow tables
-- predate the current schema. Data backfill lives in scripts/data-fixes.
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS catalogTestId VARCHAR(191) NULL AFTER referringHospitalId;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS packageId VARCHAR(191) NULL AFTER catalogTestId;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS sampleId VARCHAR(80) NULL AFTER priority;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS sampleCollectedAt DATETIME(3) NULL AFTER sampleId;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS assignedTo VARCHAR(191) NULL AFTER sampleCollectedAt;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS rejectionReason TEXT NULL AFTER assignedTo;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS homeCollection TINYINT(1) NOT NULL DEFAULT 0 AFTER rejectionReason;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS collectionAddress TEXT NULL AFTER homeCollection;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS preparationInstructions TEXT NULL AFTER collectionAddress;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS unitPrice DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER preparationInstructions;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS homeCollectionCharge DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER unitPrice;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS abnormalFlag VARCHAR(30) NULL AFTER homeCollectionCharge;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS clinicalNotes TEXT NULL AFTER abnormalFlag;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS invoiceId VARCHAR(191) NULL AFTER clinicalNotes;
ALTER TABLE testrequest ADD COLUMN IF NOT EXISTS reportRecordId VARCHAR(191) NULL AFTER invoiceId;

ALTER TABLE sample MODIFY COLUMN testRequestId VARCHAR(191) NULL;
ALTER TABLE sample MODIFY COLUMN hospitalId VARCHAR(191) NULL;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS barcodeValue VARCHAR(191) NULL AFTER hospitalId;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS collectedAt DATETIME(3) NULL AFTER barcodeValue;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS receivedAt DATETIME(3) NULL AFTER collectedAt;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS processedAt DATETIME(3) NULL AFTER receivedAt;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS disposedAt DATETIME(3) NULL AFTER processedAt;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS temperature VARCHAR(40) NULL AFTER disposedAt;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS containerType VARCHAR(80) NULL AFTER temperature;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS rejectionReason TEXT NULL AFTER containerType;
ALTER TABLE sample ADD COLUMN IF NOT EXISTS assignedTo VARCHAR(191) NULL AFTER rejectionReason;

ALTER TABLE medicalrecord ADD COLUMN IF NOT EXISTS category VARCHAR(100) NULL AFTER type;
