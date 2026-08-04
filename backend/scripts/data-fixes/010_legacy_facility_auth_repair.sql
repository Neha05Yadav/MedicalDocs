-- Keep the documented local demo credential consistent while preserving the
-- existing clinic tenant and every row owned by it.
UPDATE user
SET password = '$2b$10$CBtazEQA16s3EzqfOpTRa.zEadwGB7RPZv2D8bm1KHm8jKMyqtEFS',
    status = 'Active',
    hospitalId = 'clinic-1',
    updatedAt = CURRENT_TIMESTAMP(3)
WHERE LOWER(email) = 'clinic@demo.com';
