ALTER TABLE hospital_profile
  ADD COLUMN pharmacyOwnerName VARCHAR(191) NULL AFTER adminContact,
  ADD COLUMN pharmacyGstNumber VARCHAR(40) NULL AFTER pharmacyOwnerName,
  ADD COLUMN pharmacyServiceAreas TEXT NULL AFTER pharmacyGstNumber,
  ADD COLUMN pharmacyDeliveryRadius VARCHAR(40) NULL AFTER pharmacyServiceAreas,
  ADD COLUMN pharmacyMinimumOrder DECIMAL(12,2) NULL AFTER pharmacyDeliveryRadius,
  ADD COLUMN pharmacyHomeDelivery TINYINT(1) NOT NULL DEFAULT 0 AFTER pharmacyMinimumOrder,
  ADD COLUMN pharmacyStorePickup TINYINT(1) NOT NULL DEFAULT 0 AFTER pharmacyHomeDelivery;
