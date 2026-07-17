const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uploadsDirectory = path.join(__dirname, 'uploads');

function detectMimeType(buffer, fileName) {
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
    return 'image/png';
  }
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return 'image/jpeg';
  }
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return 'application/pdf';
  }
  if (['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'))) {
    return 'image/gif';
  }
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  const extension = path.extname(fileName).toLowerCase();
  const extensionTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return extensionTypes[extension] || 'application/octet-stream';
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  });
}

async function createTables(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS stored_file (
      id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      fileName VARCHAR(255) NOT NULL,
      relativePath VARCHAR(512) NOT NULL UNIQUE,
      mimeType VARCHAR(127) NOT NULL,
      sizeBytes BIGINT UNSIGNED NOT NULL,
      sha256 CHAR(64) NOT NULL,
      content LONGBLOB NOT NULL,
      sourceLastModifiedAt DATETIME(3) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_stored_file_sha256 (sha256)
    )
  `);

  // Keep the generated identifier compatible with this database's existing
  // utf8mb4_unicode_ci identifiers, including when an earlier empty table exists.
  await connection.query(`
    ALTER TABLE stored_file
    MODIFY id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS stored_file_medical_record (
      storedFileId CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      medicalRecordId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (storedFileId, medicalRecordId),
      INDEX idx_file_medical_record (medicalRecordId),
      CONSTRAINT fk_file_mapping_stored_file
        FOREIGN KEY (storedFileId) REFERENCES stored_file(id) ON DELETE CASCADE,
      CONSTRAINT fk_file_mapping_medical_record
        FOREIGN KEY (medicalRecordId) REFERENCES medicalrecord(id) ON DELETE CASCADE
    )
  `);
}

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from backend/.env');
  }
  if (!fs.existsSync(uploadsDirectory)) {
    throw new Error(`Uploads directory not found: ${uploadsDirectory}`);
  }

  const filePaths = listFiles(uploadsDirectory);
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    await createTables(connection);
    await connection.beginTransaction();

    let linkedFiles = 0;
    let totalBytes = 0;

    for (const absolutePath of filePaths) {
      const content = fs.readFileSync(absolutePath);
      const stats = fs.statSync(absolutePath);
      const relativePath = path
        .relative(uploadsDirectory, absolutePath)
        .split(path.sep)
        .join('/');
      const fileName = path.basename(absolutePath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      const mimeType = detectMimeType(content, fileName);

      const [existingRows] = await connection.execute(
        'SELECT id FROM stored_file WHERE relativePath = ?',
        [relativePath],
      );
      const storedFileId = existingRows[0]?.id || crypto.randomUUID();

      await connection.execute(
        `INSERT INTO stored_file
          (id, fileName, relativePath, mimeType, sizeBytes, sha256, content, sourceLastModifiedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          fileName = VALUES(fileName),
          mimeType = VALUES(mimeType),
          sizeBytes = VALUES(sizeBytes),
          sha256 = VALUES(sha256),
          content = VALUES(content),
          sourceLastModifiedAt = VALUES(sourceLastModifiedAt)`,
        [
          storedFileId,
          fileName,
          relativePath,
          mimeType,
          content.length,
          sha256,
          content,
          stats.mtime,
        ],
      );

      const [records] = await connection.execute(
        `SELECT id FROM medicalrecord
         WHERE fileUrl = ? OR fileUrl = ?`,
        [fileName, `/uploads/${relativePath}`],
      );

      for (const record of records) {
        await connection.execute(
          `INSERT IGNORE INTO stored_file_medical_record
            (storedFileId, medicalRecordId)
           VALUES (?, ?)`,
          [storedFileId, record.id],
        );
      }

      if (records.length > 0) linkedFiles += 1;
      totalBytes += content.length;
      console.log(
        `${relativePath}: ${content.length} bytes, ${mimeType}, ${records.length} record link(s)`,
      );
    }

    await connection.commit();
    console.log(
      `Migration complete: ${filePaths.length} files, ${totalBytes} bytes, ` +
        `${linkedFiles} linked files, ${filePaths.length - linkedFiles} unlinked files.`,
    );
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error('Upload migration failed:', error);
  process.exit(1);
});
