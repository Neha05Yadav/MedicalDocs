const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function upsertUser(connection, values) {
  const password = await bcrypt.hash('Demo@123', 10);
  await connection.query(
    `INSERT INTO user (id, email, password, role, name, status, hospitalId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 'Active', ?, NOW(3), NOW(3))
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       role = VALUES(role),
       hospitalId = COALESCE(NULLIF(user.hospitalId, ''), VALUES(hospitalId)),
       updatedAt = NOW(3)`,
    [
      values.id,
      values.email,
      password,
      values.role,
      values.name,
      values.hospitalId || null,
    ],
  );
}

async function main() {
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required in backend/.env');
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const ids = {
    hospital: 'demo-hospital',
    clinic: 'demo-clinic',
    lab: 'demo-lab',
    hospitalDoctor: 'demo-hospital-doctor',
    clinicDoctor: 'demo-clinic-doctor',
    patient: 'MD00001',
    patientUser: 'demo-patient-user',
  };

  await db.beginTransaction();
  try {
    for (const facility of [
      [
        ids.hospital,
        'City Care Hospital',
        'hospital@demo.com',
        'HOSPITAL',
        'Active',
        1,
      ],
      [
        ids.clinic,
        'Wellness Family Clinic',
        'clinic@demo.com',
        'CLINIC',
        'Active',
        1,
      ],
      [ids.lab, 'Apex Diagnostics', 'lab@demo.com', 'LAB', 'Active', 1],
    ]) {
      await db.query(
        `INSERT INTO hospital (id, name, email, phone, address, type, status, isVerified, createdAt, updatedAt)
         VALUES (?, ?, ?, '+91 9876500000', 'New Delhi, India', ?, ?, ?, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type), status = VALUES(status), updatedAt = NOW(3)`,
        facility,
      );
    }
    await upsertUser(db, {
      id: 'demo-hospital-user',
      email: 'hospital@demo.com',
      role: 'HOSPITAL',
      name: 'City Care Hospital',
      hospitalId: ids.hospital,
    });
    await upsertUser(db, {
      id: 'demo-clinic-user',
      email: 'clinic@demo.com',
      role: 'CLINIC',
      name: 'Wellness Family Clinic',
      hospitalId: ids.clinic,
    });
    await upsertUser(db, {
      id: 'demo-lab-user',
      email: 'lab@demo.com',
      role: 'LABORATORY',
      name: 'Apex Diagnostics',
      hospitalId: ids.lab,
    });
    await upsertUser(db, {
      id: ids.patientUser,
      email: 'patient@demo.com',
      role: 'PATIENT',
      name: 'Aarav Sharma',
    });

    await db.query(
      `INSERT INTO patient (id, name, email, phone, gender, dateOfBirth, bloodGroup, address, createdAt, updatedAt)
       VALUES (?, 'Aarav Sharma', 'patient@demo.com', '+91 9000000001', 'Male', '1992-04-16', 'O+', 'New Delhi, India', NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE name = VALUES(name), updatedAt = NOW(3)`,
      [ids.patient],
    );
    for (const doctor of [
      [
        ids.hospitalDoctor,
        'Dr. Meera Kapoor',
        'meera@citycare.demo',
        ids.hospital,
        'Internal Medicine',
        800,
      ],
      [
        ids.clinicDoctor,
        'Dr. Rohan Verma',
        'clinic@demo.com',
        ids.clinic,
        'General Medicine',
        600,
      ],
    ]) {
      await db.query(
        `INSERT INTO doctor (id, name, email, phone, hospitalId, specialization, department, status, consultationFee, slotDurationMinutes, createdAt, updatedAt)
         VALUES (?, ?, ?, '+91 9000000010', ?, ?, ?, 'Active', ?, 30, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE name = VALUES(name), consultationFee = VALUES(consultationFee), updatedAt = NOW(3)`,
        [
          doctor[0],
          doctor[1],
          doctor[2],
          doctor[3],
          doctor[4],
          doctor[4],
          doctor[5],
        ],
      );
    }
    for (let weekday = 1; weekday <= 6; weekday += 1) {
      await db.query(
        `INSERT INTO doctor_availability (id, doctorId, weekday, startTime, endTime, slotDurationMinutes, active, createdAt, updatedAt)
         VALUES (?, ?, ?, '09:00:00', '17:00:00', 30, 1, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE startTime = VALUES(startTime), endTime = VALUES(endTime), active = 1`,
        [
          `availability-${ids.clinicDoctor}-${weekday}`,
          ids.clinicDoctor,
          weekday,
        ],
      );
    }
    const catalog = [
      [
        'CBC',
        'Complete Blood Count',
        'Pathology Test',
        'Blood',
        'Fasting not required',
        450,
      ],
      [
        'LFT',
        'Liver Function Test',
        'Pathology Test',
        'Blood',
        '8–10 hours fasting preferred',
        900,
      ],
      [
        'THYROID',
        'Thyroid Profile',
        'Pathology Test',
        'Blood',
        'Morning sample preferred',
        700,
      ],
      [
        'XRAY-CHEST',
        'Chest X-Ray',
        'Radiology',
        'Imaging',
        'Remove metallic objects',
        800,
      ],
    ];
    for (const item of catalog) {
      await db.query(
        `INSERT INTO lab_test_catalog (id, laboratoryId, code, name, category, sampleType, preparationInstructions, price, homeCollectionCharge, active, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 150, 1, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), preparationInstructions = VALUES(preparationInstructions)`,
        [`lab-test-${item[0]}`, ids.lab, ...item],
      );
    }
    await db.query(
      `INSERT INTO lab_test_package (id, laboratoryId, code, name, description, listPrice, packagePrice, discountPercent, active, createdAt, updatedAt)
       VALUES ('demo-health-package', ?, 'WELLNESS', 'Essential Wellness Package', 'CBC, LFT and Thyroid Profile', 2050, 1699, 17.12, 1, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE packagePrice = VALUES(packagePrice), active = 1`,
      [ids.lab],
    );
    for (const code of ['CBC', 'LFT', 'THYROID']) {
      await db.query(
        `INSERT IGNORE INTO lab_test_package_item (packageId, testId, createdAt)
         VALUES ('demo-health-package', ?, NOW(3))`,
        [`lab-test-${code}`],
      );
    }
    await db.commit();
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
  console.log('Demo data seeded. Password for all demo users: Demo@123');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
