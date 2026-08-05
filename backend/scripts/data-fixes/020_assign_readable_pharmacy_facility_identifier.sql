SET @legacy_pharmacy_id := (
  SELECT id
  FROM hospital
  WHERE UPPER(type) = 'PHARMACY'
    AND id NOT REGEXP '^PHM[0-9]{5}$'
  ORDER BY createdAt, id
  LIMIT 1
);

SET @next_pharmacy_number := (
  SELECT COALESCE(MAX(CAST(SUBSTRING(id, 4) AS UNSIGNED)), 0) + 1
  FROM hospital
  WHERE UPPER(type) = 'PHARMACY'
    AND id REGEXP '^PHM[0-9]{5}$'
);

SET @readable_pharmacy_id := CONCAT('PHM', LPAD(@next_pharmacy_number, 5, '0'));

INSERT INTO hospital
  (id, name, address, phone, email, createdAt, updatedAt, status, isVerified, licenseNumber, type)
SELECT
  @readable_pharmacy_id, name, address, phone, email, createdAt, updatedAt,
  status, isVerified, licenseNumber, type
FROM hospital
WHERE id = @legacy_pharmacy_id;

UPDATE accessrequest SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE appointment SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE doctor SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE admission SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE billing_catalog SET facilityId = @readable_pharmacy_id WHERE facilityId = @legacy_pharmacy_id;
UPDATE billing_invoice SET facilityId = @readable_pharmacy_id WHERE facilityId = @legacy_pharmacy_id;
UPDATE insurance_claim SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE hospital_profile SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE lab_test_catalog SET laboratoryId = @readable_pharmacy_id WHERE laboratoryId = @legacy_pharmacy_id;
UPDATE lab_test_package SET laboratoryId = @readable_pharmacy_id WHERE laboratoryId = @legacy_pharmacy_id;
UPDATE payment SET facilityId = @readable_pharmacy_id WHERE facilityId = @legacy_pharmacy_id;
UPDATE hospital_room SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE hospitalsubscription SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE invoice SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE labservice SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE medicalrecord SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE notification SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE prescription SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE sample SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE testrequest SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;
UPDATE user SET hospitalId = @readable_pharmacy_id WHERE hospitalId = @legacy_pharmacy_id;

DELETE FROM hospital WHERE id = @legacy_pharmacy_id;
