-- Required system bootstrap data. Safe to run repeatedly.
INSERT IGNORE INTO prescription_id_sequence (sequenceName, nextValue)
VALUES ('prescription', 1);
