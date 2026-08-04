-- One-time legacy repair: infer missing user-to-facility links only when the
-- doctor, email, or facility name match is unambiguous.
UPDATE user u
INNER JOIN doctor d ON LOWER(d.email) = LOWER(u.email)
SET u.hospitalId = d.hospitalId
WHERE u.hospitalId IS NULL AND d.hospitalId IS NOT NULL;

UPDATE user u
INNER JOIN (
  SELECT LOWER(email) AS emailKey, MIN(id) AS hospitalId
  FROM hospital
  WHERE email IS NOT NULL AND email <> ''
  GROUP BY LOWER(email)
  HAVING COUNT(*) = 1
) matched ON matched.emailKey = LOWER(u.email)
SET u.hospitalId = matched.hospitalId
WHERE u.hospitalId IS NULL;

UPDATE user u
INNER JOIN (
  SELECT LOWER(TRIM(name)) AS nameKey, MIN(id) AS hospitalId
  FROM hospital
  WHERE name IS NOT NULL AND name <> ''
  GROUP BY LOWER(TRIM(name))
  HAVING COUNT(*) = 1
) matched ON matched.nameKey = LOWER(TRIM(u.name))
SET u.hospitalId = matched.hospitalId
WHERE u.hospitalId IS NULL
  AND UPPER(u.role) IN ('HOSPITAL', 'CLINIC', 'DOCTOR', 'LAB', 'LABORATORY');
