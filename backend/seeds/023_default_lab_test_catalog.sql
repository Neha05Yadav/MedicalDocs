INSERT INTO lab_test_catalog
  (id, laboratoryId, code, name, category, sampleType,
   preparationInstructions, turnaroundHours, price,
   homeCollectionCharge, taxRate, active, createdAt, updatedAt)
SELECT
  CONCAT('catalog-', h.id, '-', template.code),
  h.id,
  template.code,
  template.name,
  template.category,
  template.sampleType,
  template.preparationInstructions,
  template.turnaroundHours,
  template.price,
  150.00,
  0.00,
  1,
  NOW(3),
  NOW(3)
FROM hospital h
JOIN (
  SELECT 'CBC' code, 'Complete Blood Count (CBC)' name, 'Hematology' category,
         'Blood' sampleType, 'No fasting required' preparationInstructions,
         12 turnaroundHours, 450.00 price
  UNION ALL
  SELECT 'FBS', 'Fasting Blood Sugar', 'Diabetes', 'Blood',
         'Fast for 8-10 hours; water is allowed', 8, 180.00
  UNION ALL
  SELECT 'HBA1C', 'HbA1c (Glycated Hemoglobin)', 'Diabetes', 'Blood',
         'No fasting required', 12, 550.00
  UNION ALL
  SELECT 'THYROID', 'Thyroid Profile (T3, T4, TSH)', 'Hormones', 'Blood',
         'Morning sample preferred; follow medicine advice from your doctor', 24, 750.00
  UNION ALL
  SELECT 'LIPID', 'Lipid Profile', 'Cardiac Health', 'Blood',
         'Fast for 9-12 hours; water is allowed', 24, 700.00
  UNION ALL
  SELECT 'LFT', 'Liver Function Test (LFT)', 'Organ Function', 'Blood',
         'Fast for 8 hours if advised by your doctor', 24, 650.00
  UNION ALL
  SELECT 'KFT', 'Kidney Function Test (KFT)', 'Organ Function', 'Blood',
         'No special preparation; stay normally hydrated', 24, 650.00
  UNION ALL
  SELECT 'VITD', 'Vitamin D (25-OH)', 'Vitamins', 'Blood',
         'No fasting required', 24, 1100.00
) template
WHERE UPPER(h.type) IN ('LAB', 'LABORATORY')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  sampleType = VALUES(sampleType),
  preparationInstructions = VALUES(preparationInstructions),
  turnaroundHours = VALUES(turnaroundHours),
  price = VALUES(price),
  active = 1,
  updatedAt = NOW(3);
