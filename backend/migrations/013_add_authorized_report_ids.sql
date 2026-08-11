ALTER TABLE accessrequest
  ADD COLUMN IF NOT EXISTS authorizedReportIds TEXT NULL AFTER reportTypes;
