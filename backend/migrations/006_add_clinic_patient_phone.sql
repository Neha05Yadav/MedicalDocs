-- The clinic patient form stores a contact number, but the legacy table
-- predates that field. Add it without replacing any clinic-owned rows.
ALTER TABLE clinic_patient
  ADD COLUMN phone VARCHAR(191) NULL AFTER name;
