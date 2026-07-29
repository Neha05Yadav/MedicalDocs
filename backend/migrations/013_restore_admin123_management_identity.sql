-- Restore the requested management work identity with the same local
-- credential convention used by the other management demo accounts.
INSERT INTO user
  (id, email, password, role, name, createdAt, updatedAt, phone, hospitalId, status, permissions)
VALUES
  ('management-admin123', 'Admin123@gmail.com',
   '$2b$10$CBtazEQA16s3EzqfOpTRa.zEadwGB7RPZv2D8bm1KHm8jKMyqtEFS',
   'ADMIN', 'Admin', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3),
   NULL, NULL, 'Active', NULL)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  role = VALUES(role),
  name = VALUES(name),
  status = VALUES(status),
  updatedAt = VALUES(updatedAt);
