ALTER TABLE notification
  ADD COLUMN IF NOT EXISTS actionUrl TEXT NULL AFTER actionRequired;
