INSERT INTO doctor_availability
  (id, doctorId, weekday, startTime, endTime, slotDurationMinutes, active, createdAt, updatedAt)
SELECT
  CONCAT('avail-', MD5(CONCAT(d.id, '-', weekdays.weekday))),
  d.id,
  weekdays.weekday,
  '09:00:00',
  '17:00:00',
  COALESCE(NULLIF(d.slotDurationMinutes, 0), 30),
  1,
  NOW(3),
  NOW(3)
FROM doctor d
JOIN hospital h ON h.id = d.hospitalId
JOIN (
  SELECT 1 weekday UNION ALL SELECT 2 UNION ALL SELECT 3
  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) weekdays
WHERE UPPER(d.status) = 'ACTIVE'
  AND UPPER(h.status) = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1
    FROM doctor_availability existing
    WHERE existing.doctorId = d.id
  )
ON DUPLICATE KEY UPDATE
  active = 1,
  updatedAt = NOW(3);
