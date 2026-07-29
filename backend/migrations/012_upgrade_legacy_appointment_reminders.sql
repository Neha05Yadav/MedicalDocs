-- Appointment reminder worker expects this lifecycle field on upgraded
-- databases. Existing appointment rows remain unchanged.
ALTER TABLE appointment
  ADD COLUMN reminderSentAt DATETIME(3) NULL AFTER notes;
