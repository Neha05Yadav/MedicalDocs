-- One-time legacy repair after the sample barcode column is introduced.
UPDATE sample
SET barcodeValue = CONCAT('SMP-', UPPER(LEFT(REPLACE(id, '-', ''), 12)))
WHERE barcodeValue IS NULL OR barcodeValue = '';
