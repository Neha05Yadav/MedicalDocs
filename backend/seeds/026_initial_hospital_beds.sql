-- Give active hospitals without configured inventory a small usable bed master.
-- Hospitals that already have rooms/beds are intentionally left unchanged.
INSERT INTO hospital_room
  (id, hospitalId, ward, roomNumber, bedNumber, roomType, dailyRate,
   nursingRatePerDay, status, createdAt, updatedAt)
SELECT
  CONCAT('bed-', MD5(CONCAT(h.id, '-', seed.ward, '-', seed.roomNumber, '-', seed.bedNumber))),
  h.id,
  seed.ward,
  seed.roomNumber,
  seed.bedNumber,
  seed.roomType,
  seed.dailyRate,
  seed.nursingRatePerDay,
  'AVAILABLE',
  NOW(3),
  NOW(3)
FROM hospital h
JOIN (
  SELECT 'General Ward' ward, 'G-101' roomNumber, 'B1' bedNumber,
         'General' roomType, 1500.00 dailyRate, 500.00 nursingRatePerDay
  UNION ALL
  SELECT 'General Ward', 'G-101', 'B2', 'General', 1500.00, 500.00
  UNION ALL
  SELECT 'Private Ward', 'P-201', 'B1', 'Private', 3500.00, 750.00
  UNION ALL
  SELECT 'Critical Care', 'ICU-01', 'B1', 'ICU', 8000.00, 1500.00
) seed
WHERE UPPER(h.type) = 'HOSPITAL'
  AND UPPER(h.status) = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1 FROM hospital_room existing WHERE existing.hospitalId = h.id
  )
ON DUPLICATE KEY UPDATE updatedAt = VALUES(updatedAt);
