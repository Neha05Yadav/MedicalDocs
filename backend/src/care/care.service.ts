/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createHash, createHmac, randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { MysqlService } from '../mysql.service';

@Injectable()
export class CareService implements OnModuleInit, OnModuleDestroy {
  private reminderTimer?: NodeJS.Timeout;

  constructor(private readonly db: MysqlService) {}

  onModuleInit() {
    this.reminderTimer = setInterval(
      () => {
        void this.runAppointmentReminders().catch((error) =>
          console.warn(
            'Appointment reminder job failed:',
            error?.message || error,
          ),
        );
      },
      15 * 60 * 1000,
    );
    this.reminderTimer.unref();
    setTimeout(
      () => void this.runAppointmentReminders().catch(() => undefined),
      5000,
    ).unref();
  }

  onModuleDestroy() {
    if (this.reminderTimer) clearInterval(this.reminderTimer);
  }

  private role(user: any) {
    return String(user?.role || '').toUpperCase();
  }

  private async account(user: any) {
    return this.db.queryOne<any>('SELECT * FROM user WHERE email = ?', [
      user.email,
    ]);
  }

  private async patient(user: any) {
    const row = await this.db.queryOne<any>(
      'SELECT * FROM patient WHERE email = ? OR id = ? LIMIT 1',
      [user.email, user.sub || ''],
    );
    if (!row)
      throw new ForbiddenException(
        'Patient profile is not linked to this account.',
      );
    return row;
  }

  private async facility(user: any, accepted: string[] = []) {
    const account = await this.account(user);
    const row = account?.hospitalId
      ? await this.db.queryOne<any>('SELECT * FROM hospital WHERE id = ?', [
          account.hospitalId,
        ])
      : await this.db.queryOne<any>('SELECT * FROM hospital WHERE email = ?', [
          user.email,
        ]);
    if (!row)
      throw new ForbiddenException('Facility is not linked to this account.');
    const type = String(row.type || '').toUpperCase();
    if (accepted.length && !accepted.includes(type))
      throw new ForbiddenException(
        'This operation is not available for your facility type.',
      );
    return row;
  }

  private async notifyPatient(
    patientId: string,
    type: string,
    title: string,
    message: string,
    actionUrl?: string,
  ) {
    const patient = await this.db.queryOne<any>(
      'SELECT email FROM patient WHERE id = ?',
      [patientId],
    );
    const user = patient?.email
      ? await this.db.queryOne<any>('SELECT id FROM user WHERE email = ?', [
          patient.email,
        ])
      : null;
    if (!user) return;
    await this.db.query(
      `INSERT INTO notification
       (id, userId, type, title, message, isRead, actionRequired, actionUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 0, 1, ?, NOW(3), NOW(3))`,
      [uuidv4(), user.id, type, title, message, actionUrl || null],
    );
  }

  private async runAppointmentReminders() {
    const due = await this.db.query<any>(
      `SELECT a.id, a.patientId, a.dateTime, d.name doctorName, h.name facilityName
       FROM appointment a JOIN doctor d ON d.id = a.doctorId JOIN hospital h ON h.id = a.hospitalId
       WHERE a.status IN ('SCHEDULED','CONFIRMED')
       AND a.reminderSentAt IS NULL
       AND a.dateTime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
       ORDER BY a.dateTime LIMIT 200`,
    );
    for (const appointment of due) {
      await this.notifyPatient(
        appointment.patientId,
        'APPOINTMENT_REMINDER',
        'Upcoming appointment',
        `${appointment.doctorName} at ${appointment.facilityName} · ${new Date(appointment.dateTime).toLocaleString('en-IN')}.`,
        '/patient/appointments',
      );
      await this.db.query(
        'UPDATE appointment SET reminderSentAt = NOW(3), updatedAt = NOW(3) WHERE id = ? AND reminderSentAt IS NULL',
        [appointment.id],
      );
    }
  }

  private async audit(
    user: any,
    action: string,
    entity: string,
    entityId: string,
    after: any,
  ) {
    await this.db.query(
      `INSERT INTO audit_log
       (id, userId, user_email, action_type, entity_type, entityId, afterData, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        uuidv4(),
        user.sub || null,
        user.email || null,
        action,
        entity,
        entityId,
        JSON.stringify(after),
      ],
    );
  }

  async providers(user: any) {
    const role = this.role(user);
    const params: any[] = [];
    let facilityFilter = '';
    if (!role.includes('PATIENT')) {
      const facility = await this.facility(user, ['HOSPITAL', 'CLINIC']);
      facilityFilter = 'AND h.id = ?';
      params.push(facility.id);
    }
    return this.db.query(
      `SELECT d.id doctorId, d.name doctorName, d.specialization, d.department,
              d.consultationFee, d.slotDurationMinutes, h.id hospitalId, h.name hospitalName, h.type facilityType
       FROM doctor d INNER JOIN hospital h ON h.id = d.hospitalId
       WHERE UPPER(d.status) = 'ACTIVE' AND UPPER(h.status) = 'ACTIVE'
       ${facilityFilter}
       ORDER BY h.name, d.name`,
      params,
    );
  }

  async availability(doctorId: string, dateValue: string) {
    if (!doctorId || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue || ''))
      throw new BadRequestException('Doctor and date are required.');
    const date = new Date(`${dateValue}T00:00:00`);
    const weekday = date.getDay();
    const rules = await this.db.query<any>(
      `SELECT * FROM doctor_availability
       WHERE doctorId = ? AND weekday = ? AND active = 1 ORDER BY startTime`,
      [doctorId, weekday],
    );
    const busy = await this.db.query<any>(
      `SELECT dateTime, COALESCE(endTime, DATE_ADD(dateTime, INTERVAL 30 MINUTE)) endTime
       FROM appointment WHERE doctorId = ? AND DATE(dateTime) = ?
       AND status IN ('SCHEDULED','CONFIRMED','CHECKED_IN','IN_CONSULTATION')`,
      [doctorId, dateValue],
    );
    const timeOff = await this.db.query<any>(
      `SELECT startsAt, endsAt FROM doctor_time_off
       WHERE doctorId = ? AND startsAt < DATE_ADD(?, INTERVAL 1 DAY) AND endsAt >= ?`,
      [doctorId, dateValue, dateValue],
    );
    const slots: any[] = [];
    for (const rule of rules) {
      const [startHour, startMinute] = String(rule.startTime)
        .split(':')
        .map(Number);
      const [endHour, endMinute] = String(rule.endTime).split(':').map(Number);
      let cursor = new Date(date);
      cursor.setHours(startHour, startMinute, 0, 0);
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);
      const duration = Number(rule.slotDurationMinutes || 30);
      while (cursor.getTime() + duration * 60000 <= end.getTime()) {
        const slotEnd = new Date(cursor.getTime() + duration * 60000);
        const blocked =
          busy.some(
            (item) =>
              cursor < new Date(item.endTime) &&
              slotEnd > new Date(item.dateTime),
          ) ||
          timeOff.some(
            (item) =>
              cursor < new Date(item.endsAt) &&
              slotEnd > new Date(item.startsAt),
          );
        if (!blocked && cursor.getTime() > Date.now())
          slots.push({
            startsAt: cursor.toISOString(),
            endsAt: slotEnd.toISOString(),
            label: cursor.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        cursor = slotEnd;
      }
    }
    return { doctorId, date: dateValue, slots };
  }

  async availabilityRules(user: any) {
    const facility = await this.facility(user, ['HOSPITAL', 'CLINIC']);
    return this.db.query(
      `SELECT da.*, d.name doctorName, d.specialization
       FROM doctor_availability da JOIN doctor d ON d.id = da.doctorId
       WHERE d.hospitalId = ? ORDER BY d.name, da.weekday, da.startTime`,
      [facility.id],
    );
  }

  async saveAvailabilityRule(user: any, body: any) {
    const facility = await this.facility(user, ['HOSPITAL', 'CLINIC']);
    const doctor = await this.db.queryOne<any>(
      'SELECT id FROM doctor WHERE id = ? AND hospitalId = ?',
      [body.doctorId, facility.id],
    );
    if (!doctor)
      throw new BadRequestException('Doctor is not part of this facility.');
    const weekday = Number(body.weekday);
    if (
      weekday < 0 ||
      weekday > 6 ||
      !/^\d{2}:\d{2}$/.test(body.startTime || '') ||
      !/^\d{2}:\d{2}$/.test(body.endTime || '') ||
      body.startTime >= body.endTime
    )
      throw new BadRequestException(
        'Valid weekday and working hours are required.',
      );
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO doctor_availability
       (id, doctorId, weekday, startTime, endTime, slotDurationMinutes, active, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 1, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE endTime = VALUES(endTime),
       slotDurationMinutes = VALUES(slotDurationMinutes), active = 1, updatedAt = NOW(3)`,
      [
        id,
        body.doctorId,
        weekday,
        `${body.startTime}:00`,
        `${body.endTime}:00`,
        Number(body.slotDurationMinutes || 30),
      ],
    );
    return { id };
  }

  async appointments(user: any, from?: string, to?: string) {
    const role = this.role(user);
    let where = '';
    const params: any[] = [];
    if (role.includes('PATIENT')) {
      const patient = await this.patient(user);
      where = 'WHERE a.patientId = ?';
      params.push(patient.id);
    } else {
      const facility = await this.facility(user, ['HOSPITAL', 'CLINIC']);
      where = 'WHERE a.hospitalId = ?';
      params.push(facility.id);
    }
    if (from) {
      where += ' AND a.dateTime >= ?';
      params.push(new Date(from));
    }
    if (to) {
      where += ' AND a.dateTime <= ?';
      params.push(new Date(to));
    }
    return this.db.query(
      `SELECT a.*, p.name patientName, p.phone patientPhone, d.name doctorName,
              d.specialization, h.name facilityName
       FROM appointment a
       JOIN patient p ON p.id = a.patientId
       JOIN doctor d ON d.id = a.doctorId
       JOIN hospital h ON h.id = a.hospitalId
       ${where} ORDER BY a.dateTime`,
      params,
    );
  }

  async createAppointment(user: any, body: any) {
    const patient = await this.patient(user);
    const doctor = await this.db.queryOne<any>(
      `SELECT d.*, h.name facilityName FROM doctor d JOIN hospital h ON h.id = d.hospitalId
       WHERE d.id = ? AND d.hospitalId = ? AND UPPER(d.status) = 'ACTIVE'`,
      [body.doctorId, body.hospitalId],
    );
    if (!doctor)
      throw new BadRequestException('Selected provider is unavailable.');
    const startsAt = new Date(body.startsAt);
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date())
      throw new BadRequestException('Select a valid future slot.');
    const available = await this.availability(
      doctor.id,
      startsAt.toISOString().slice(0, 10),
    );
    const slot = available.slots.find(
      (item) => new Date(item.startsAt).getTime() === startsAt.getTime(),
    );
    if (!slot)
      throw new BadRequestException('This slot is no longer available.');
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO appointment
       (id, patientId, doctorId, hospitalId, dateTime, endTime, type, status, notes, reason, consultationFee, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        patient.id,
        doctor.id,
        doctor.hospitalId,
        startsAt,
        new Date(slot.endsAt),
        body.type || 'OPD',
        body.notes || null,
        body.reason || null,
        Number(doctor.consultationFee || 0),
      ],
    );
    await this.notifyPatient(
      patient.id,
      'APPOINTMENT',
      'Appointment confirmed',
      `${doctor.name} at ${doctor.facilityName} on ${startsAt.toLocaleString('en-IN')}.`,
      '/patient/appointments',
    );
    await this.audit(user, 'CREATE', 'appointment', id, body);
    return { id, message: 'Appointment booked successfully.' };
  }

  async rescheduleAppointment(user: any, id: string, body: any) {
    const patient = await this.patient(user);
    const appointment = await this.db.queryOne<any>(
      `SELECT * FROM appointment WHERE id = ? AND patientId = ?
       AND status IN ('SCHEDULED','CONFIRMED')`,
      [id, patient.id],
    );
    if (!appointment)
      throw new NotFoundException('Reschedulable appointment not found.');
    const startsAt = new Date(body.startsAt);
    const available = await this.availability(
      appointment.doctorId,
      startsAt.toISOString().slice(0, 10),
    );
    const slot = available.slots.find(
      (item) => new Date(item.startsAt).getTime() === startsAt.getTime(),
    );
    if (!slot) throw new BadRequestException('Selected slot is unavailable.');
    await this.db.query(
      `UPDATE appointment SET dateTime = ?, endTime = ?, status = 'SCHEDULED',
       rescheduledFromId = COALESCE(rescheduledFromId, id), updatedAt = NOW(3) WHERE id = ?`,
      [startsAt, new Date(slot.endsAt), id],
    );
    await this.notifyPatient(
      patient.id,
      'APPOINTMENT',
      'Appointment rescheduled',
      `Your appointment is now scheduled for ${startsAt.toLocaleString('en-IN')}.`,
      '/patient/appointments',
    );
    await this.audit(user, 'RESCHEDULE', 'appointment', id, body);
    return { success: true };
  }

  async updateAppointmentLifecycle(user: any, id: string, body: any) {
    const role = this.role(user);
    const status = String(body.status || '').toUpperCase();
    const patientCancellation =
      role.includes('PATIENT') && status === 'CANCELLED';
    if (
      !patientCancellation &&
      !['HOSPITAL', 'CLINIC', 'DOCTOR'].some((item) => role.includes(item))
    )
      throw new ForbiddenException('Not allowed.');
    const appointment = await this.db.queryOne<any>(
      `SELECT a.*, d.name doctorName, h.name facilityName
       FROM appointment a JOIN doctor d ON d.id = a.doctorId JOIN hospital h ON h.id = a.hospitalId
       WHERE a.id = ?`,
      [id],
    );
    if (!appointment) throw new NotFoundException('Appointment not found.');
    if (patientCancellation) {
      const patient = await this.patient(user);
      if (appointment.patientId !== patient.id)
        throw new ForbiddenException('Not your appointment.');
    } else {
      const facility = await this.facility(user, ['HOSPITAL', 'CLINIC']);
      if (appointment.hospitalId !== facility.id)
        throw new ForbiddenException(
          'Appointment belongs to another facility.',
        );
    }
    const allowed = [
      'CONFIRMED',
      'CHECKED_IN',
      'IN_CONSULTATION',
      'COMPLETED',
      'CANCELLED',
      'NO_SHOW',
    ];
    if (!allowed.includes(status))
      throw new BadRequestException('Invalid lifecycle status.');
    const completion = status === 'COMPLETED' ? new Date() : null;
    const cancellation = status === 'CANCELLED' ? new Date() : null;
    await this.db.query(
      `UPDATE appointment SET status = ?, checkedInAt = IF(? = 'CHECKED_IN', NOW(3), checkedInAt),
       completedAt = COALESCE(?, completedAt), cancelledAt = COALESCE(?, cancelledAt),
       cancellationReason = ?, updatedAt = NOW(3) WHERE id = ?`,
      [status, status, completion, cancellation, body.reason || null, id],
    );
    let invoiceId = appointment.invoiceId;
    if (
      status === 'COMPLETED' &&
      !invoiceId &&
      Number(appointment.consultationFee || 0) > 0
    ) {
      invoiceId = await this.createAutomaticInvoice({
        patientId: appointment.patientId,
        facilityId: appointment.hospitalId,
        facilityName: appointment.facilityName,
        facilityType: 'CLINIC',
        encounterType: 'OPD',
        appointmentId: id,
        items: [
          {
            name: `Consultation · ${appointment.doctorName}`,
            category: 'Consultation',
            quantity: 1,
            unitPrice: Number(appointment.consultationFee),
            sourceType: 'APPOINTMENT',
            sourceId: id,
          },
        ],
      });
      await this.db.query('UPDATE appointment SET invoiceId = ? WHERE id = ?', [
        invoiceId,
        id,
      ]);
    }
    await this.notifyPatient(
      appointment.patientId,
      'APPOINTMENT',
      `Appointment ${status.toLowerCase().replace('_', ' ')}`,
      `${appointment.doctorName} · ${appointment.facilityName}`,
      status === 'COMPLETED' ? '/patient/billing' : '/patient/appointments',
    );
    await this.audit(user, 'STATUS_CHANGE', 'appointment', id, { status });
    return { success: true, invoiceId };
  }

  async labCatalog(user: any, laboratoryId?: string) {
    let labId = laboratoryId;
    if (!labId) labId = (await this.facility(user, ['LAB', 'LABORATORY'])).id;
    const [tests, packages, packageItems] = await Promise.all([
      this.db.query(
        'SELECT * FROM lab_test_catalog WHERE laboratoryId = ? ORDER BY category, name',
        [labId],
      ),
      this.db.query(
        'SELECT * FROM lab_test_package WHERE laboratoryId = ? ORDER BY name',
        [labId],
      ),
      this.db.query(
        `SELECT lpi.packageId, ltc.id testId, ltc.code, ltc.name, ltc.price
         FROM lab_test_package_item lpi JOIN lab_test_catalog ltc ON ltc.id = lpi.testId
         WHERE ltc.laboratoryId = ?`,
        [labId],
      ),
    ]);
    return {
      tests,
      packages: packages.map((pkg) => ({
        ...pkg,
        tests: packageItems.filter((item) => item.packageId === pkg.id),
      })),
    };
  }

  async labProviders() {
    return this.db.query(
      `SELECT id, name, address, phone FROM hospital
       WHERE UPPER(type) IN ('LAB','LABORATORY') AND UPPER(status) = 'ACTIVE'
       ORDER BY name`,
    );
  }

  async saveLabTest(user: any, body: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    if (!body.code || !body.name || !body.sampleType || Number(body.price) < 0)
      throw new BadRequestException(
        'Code, name, sample type and price are required.',
      );
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO lab_test_catalog
       (id, laboratoryId, code, name, category, sampleType, preparationInstructions,
        turnaroundHours, price, homeCollectionCharge, taxRate, active, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(3), NOW(3))`,
      [
        id,
        lab.id,
        String(body.code).toUpperCase(),
        body.name,
        body.category || 'Pathology Test',
        body.sampleType,
        body.preparationInstructions || null,
        Number(body.turnaroundHours || 24),
        Number(body.price),
        Number(body.homeCollectionCharge || 0),
        Number(body.taxRate || 0),
      ],
    );
    await this.audit(user, 'CREATE', 'lab_test_catalog', id, body);
    return { id };
  }

  async updateLabTest(user: any, id: string, body: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    const existing = await this.db.queryOne<any>(
      'SELECT id FROM lab_test_catalog WHERE id = ? AND laboratoryId = ?',
      [id, lab.id],
    );
    if (!existing) throw new NotFoundException('Test not found.');
    await this.db.query(
      `UPDATE lab_test_catalog SET name = ?, category = ?, sampleType = ?,
       preparationInstructions = ?, turnaroundHours = ?, price = ?,
       homeCollectionCharge = ?, active = ?, updatedAt = NOW(3) WHERE id = ?`,
      [
        body.name,
        body.category,
        body.sampleType,
        body.preparationInstructions || null,
        Number(body.turnaroundHours || 24),
        Number(body.price),
        Number(body.homeCollectionCharge || 0),
        body.active === false ? 0 : 1,
        id,
      ],
    );
    return { success: true };
  }

  async saveLabPackage(user: any, body: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    const testIds = Array.isArray(body.testIds) ? body.testIds : [];
    if (!body.code || !body.name || !testIds.length)
      throw new BadRequestException(
        'Package code, name and tests are required.',
      );
    const tests = await this.db.query<any>(
      `SELECT id, price FROM lab_test_catalog WHERE laboratoryId = ? AND id IN (${testIds
        .map(() => '?')
        .join(',')})`,
      [lab.id, ...testIds],
    );
    if (tests.length !== testIds.length)
      throw new BadRequestException('Package contains an invalid test.');
    const listPrice = tests.reduce((sum, test) => sum + Number(test.price), 0);
    const packagePrice = Number(body.packagePrice);
    if (packagePrice < 0 || packagePrice > listPrice)
      throw new BadRequestException(
        'Package price must not exceed list price.',
      );
    const id = uuidv4();
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO lab_test_package
         (id, laboratoryId, code, name, description, listPrice, packagePrice, discountPercent, active, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(3), NOW(3))`,
        [
          id,
          lab.id,
          String(body.code).toUpperCase(),
          body.name,
          body.description || null,
          listPrice,
          packagePrice,
          listPrice ? ((listPrice - packagePrice) / listPrice) * 100 : 0,
        ],
      );
      for (const testId of testIds)
        await connection.execute(
          'INSERT INTO lab_test_package_item (packageId, testId, createdAt) VALUES (?, ?, NOW(3))',
          [id, testId],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return { id };
  }

  async createLabOrder(user: any, body: any) {
    const patient = this.role(user).includes('PATIENT')
      ? await this.patient(user)
      : await this.db.queryOne<any>('SELECT * FROM patient WHERE id = ?', [
          body.patientId,
        ]);
    if (!patient) throw new BadRequestException('Patient not found.');
    const lab = await this.db.queryOne<any>(
      `SELECT * FROM hospital WHERE id = ? AND UPPER(type) IN ('LAB','LABORATORY')`,
      [body.laboratoryId],
    );
    if (!lab) throw new BadRequestException('Laboratory not found.');
    const selectedTests = Array.isArray(body.testIds) ? body.testIds : [];
    let tests = selectedTests.length
      ? await this.db.query<any>(
          `SELECT * FROM lab_test_catalog WHERE laboratoryId = ? AND active = 1
           AND id IN (${selectedTests.map(() => '?').join(',')})`,
          [lab.id, ...selectedTests],
        )
      : [];
    let packageRow: any = null;
    if (body.packageId) {
      packageRow = await this.db.queryOne<any>(
        'SELECT * FROM lab_test_package WHERE id = ? AND laboratoryId = ? AND active = 1',
        [body.packageId, lab.id],
      );
      if (!packageRow) throw new BadRequestException('Package not found.');
      tests = await this.db.query<any>(
        `SELECT t.* FROM lab_test_package_item pi JOIN lab_test_catalog t ON t.id = pi.testId
         WHERE pi.packageId = ?`,
        [packageRow.id],
      );
    }
    if (!tests.length)
      throw new BadRequestException('Select at least one test or package.');
    const orderGroup = uuidv4();
    const created: string[] = [];
    for (const test of tests) {
      const id = uuidv4();
      const sampleId = `SMP-${Date.now().toString().slice(-7)}-${created.length + 1}`;
      const price = packageRow
        ? Number(packageRow.packagePrice) / tests.length
        : Number(test.price);
      await this.db.query(
        `INSERT INTO testrequest
         (id, patientId, hospitalId, doctorId, referringHospitalId, catalogTestId, packageId,
          testType, status, priority, sampleId, homeCollection, collectionAddress,
          preparationInstructions, unitPrice, homeCollectionCharge, clinicalNotes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Collection', ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
        [
          id,
          patient.id,
          lab.id,
          body.doctorId || null,
          body.referringHospitalId || null,
          test.id,
          packageRow?.id || null,
          test.name,
          body.priority || 'Normal',
          sampleId,
          body.homeCollection ? 1 : 0,
          body.collectionAddress || null,
          test.preparationInstructions || null,
          price,
          body.homeCollection && created.length === 0
            ? Number(test.homeCollectionCharge || 0)
            : 0,
          `Order group: ${orderGroup}${body.clinicalNotes ? ` · ${body.clinicalNotes}` : ''}`,
        ],
      );
      await this.db.query(
        `INSERT INTO sample
         (id, sampleType, patientId, testRequestId, status, hospitalId, barcodeValue, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 'Registered', ?, ?, NOW(3), NOW(3))`,
        [uuidv4(), test.sampleType, patient.id, id, lab.id, sampleId],
      );
      await this.db.query(
        `INSERT INTO testrequest_status_history
         (id, testRequestId, status, notes, updatedBy, createdAt)
         VALUES (?, ?, 'Pending Collection', 'Order registered', ?, NOW(3))`,
        [uuidv4(), id, user.email || null],
      );
      created.push(id);
    }
    await this.notifyPatient(
      patient.id,
      'LAB_ORDER',
      'Lab tests ordered',
      `${tests.length} test(s) booked with ${lab.name}.`,
      '/patient/records',
    );
    return { orderGroup, requestIds: created };
  }

  async labOrders(user: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    return this.db.query(
      `SELECT tr.*, p.name patientName, p.phone patientPhone, s.id sampleRecordId,
              s.status sampleStatus, s.barcodeValue, s.collectedAt, s.receivedAt, s.processedAt
       FROM testrequest tr JOIN patient p ON p.id = tr.patientId
       LEFT JOIN sample s ON s.testRequestId = tr.id
       WHERE tr.hospitalId = ? ORDER BY tr.createdAt DESC`,
      [lab.id],
    );
  }

  async updateSample(user: any, requestId: string, body: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    const request = await this.db.queryOne<any>(
      `SELECT tr.*, s.id sampleRecordId FROM testrequest tr
       LEFT JOIN sample s ON s.testRequestId = tr.id
       WHERE tr.id = ? AND tr.hospitalId = ?`,
      [requestId, lab.id],
    );
    if (!request) throw new NotFoundException('Sample request not found.');
    const status = String(body.status || '');
    const allowed = [
      'Collected',
      'Received',
      'In Processing',
      'Quality Check',
      'Rejected',
    ];
    if (!allowed.includes(status))
      throw new BadRequestException('Invalid sample status.');
    await this.db.query(
      `UPDATE sample SET status = ?, assignedTo = ?, rejectionReason = ?,
       collectedAt = IF(? = 'Collected', NOW(3), collectedAt),
       receivedAt = IF(? = 'Received', NOW(3), receivedAt),
       processedAt = IF(? = 'In Processing', NOW(3), processedAt), updatedAt = NOW(3)
       WHERE testRequestId = ?`,
      [
        status,
        body.assignedTo || null,
        body.rejectionReason || null,
        status,
        status,
        status,
        requestId,
      ],
    );
    await this.db.query(
      'UPDATE testrequest SET status = ?, assignedTo = ?, rejectionReason = ?, updatedAt = NOW(3) WHERE id = ?',
      [
        status,
        body.assignedTo || null,
        body.rejectionReason || null,
        requestId,
      ],
    );
    await this.db.query(
      `INSERT INTO testrequest_status_history
       (id, testRequestId, status, notes, updatedBy, location, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        uuidv4(),
        requestId,
        status,
        body.notes || null,
        user.email,
        body.location || null,
      ],
    );
    return { success: true };
  }

  async completeLabOrder(user: any, requestId: string, body: any) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    const request = await this.db.queryOne<any>(
      `SELECT tr.*, p.name patientName FROM testrequest tr JOIN patient p ON p.id = tr.patientId
       WHERE tr.id = ? AND tr.hospitalId = ?`,
      [requestId, lab.id],
    );
    if (!request) throw new NotFoundException('Test request not found.');
    const abnormalFlag = ['NORMAL', 'HIGH', 'LOW', 'CRITICAL'].includes(
      String(body.abnormalFlag || '').toUpperCase(),
    )
      ? String(body.abnormalFlag).toUpperCase()
      : 'NORMAL';
    const recordId = uuidv4();
    await this.db.query(
      `INSERT INTO medicalrecord
       (id, patientId, hospitalId, title, category, description, type, date, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'Laboratory', ?, 'LAB_REPORT', NOW(3), NOW(3), NOW(3))`,
      [
        recordId,
        request.patientId,
        lab.id,
        `${request.testType} Report`,
        body.resultSummary || `Result status: ${abnormalFlag}`,
      ],
    );
    const invoiceId =
      request.invoiceId ||
      (await this.createAutomaticInvoice({
        patientId: request.patientId,
        facilityId: lab.id,
        facilityName: lab.name,
        facilityType: 'LABORATORY',
        encounterType: 'DIAGNOSTIC',
        items: [
          {
            name: request.testType,
            category: 'Pathology Test',
            quantity: 1,
            unitPrice: Number(request.unitPrice || 0),
            sourceType: 'LAB_TEST',
            sourceId: request.id,
          },
          ...(Number(request.homeCollectionCharge || 0)
            ? [
                {
                  name: 'Home sample collection',
                  category: 'Home Visit',
                  quantity: 1,
                  unitPrice: Number(request.homeCollectionCharge),
                  sourceType: 'LAB_ORDER',
                  sourceId: request.id,
                },
              ]
            : []),
        ],
      }));
    await this.db.query(
      `UPDATE testrequest SET status = 'Completed', abnormalFlag = ?, reportRecordId = ?,
       invoiceId = ?, updatedAt = NOW(3) WHERE id = ?`,
      [abnormalFlag, recordId, invoiceId, requestId],
    );
    await this.db.query(
      `UPDATE sample SET status = 'Reported', processedAt = COALESCE(processedAt, NOW(3)),
       updatedAt = NOW(3) WHERE testRequestId = ?`,
      [requestId],
    );
    await this.issueDocument(
      'LAB_REPORT',
      'medicalrecord',
      recordId,
      request.patientId,
      lab.id,
      body.signerName || 'Authorized Signatory',
      body.signerRegistrationNo || null,
    );
    await this.notifyPatient(
      request.patientId,
      abnormalFlag === 'CRITICAL' ? 'CRITICAL_RESULT' : 'LAB_REPORT',
      abnormalFlag === 'CRITICAL'
        ? 'Critical result requires attention'
        : 'Lab report ready',
      `${request.testType} report is ready from ${lab.name}.`,
      '/patient/records',
    );
    return { recordId, invoiceId, abnormalFlag };
  }

  async sampleLabel(user: any, requestId: string) {
    const lab = await this.facility(user, ['LAB', 'LABORATORY']);
    const sample = await this.db.queryOne<any>(
      `SELECT s.*, p.name patientName, tr.testType FROM sample s
       JOIN patient p ON p.id = s.patientId JOIN testrequest tr ON tr.id = s.testRequestId
       WHERE s.testRequestId = ? AND s.hospitalId = ?`,
      [requestId, lab.id],
    );
    if (!sample) throw new NotFoundException('Sample not found.');
    const qr = await QRCode.toDataURL(sample.barcodeValue, {
      margin: 0,
      width: 180,
    });
    const image = qr.split(',')[1];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="240">
      <rect width="100%" height="100%" fill="white"/>
      <image href="data:image/png;base64,${image}" x="20" y="20" width="180" height="180"/>
      <text x="225" y="55" font-family="Arial" font-size="24" font-weight="bold">${this.escapeXml(sample.barcodeValue)}</text>
      <text x="225" y="92" font-family="Arial" font-size="18">${this.escapeXml(sample.patientName)}</text>
      <text x="225" y="126" font-family="Arial" font-size="16">${this.escapeXml(sample.testType)}</text>
      <text x="225" y="158" font-family="Arial" font-size="16">Sample: ${this.escapeXml(sample.sampleType)}</text>
      <text x="225" y="190" font-family="Arial" font-size="14">${this.escapeXml(lab.name)}</text>
    </svg>`;
    return {
      content: Buffer.from(svg),
      mimeType: 'image/svg+xml',
      fileName: `${sample.barcodeValue}.svg`,
    };
  }

  async inpatientWorkspace(user: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const [rooms, admissions, patients, doctors] = await Promise.all([
      this.db.query(
        'SELECT * FROM hospital_room WHERE hospitalId = ? ORDER BY ward, roomNumber, bedNumber',
        [hospital.id],
      ),
      this.db.query(
        `SELECT a.*, p.name patientName, p.phone patientPhone, d.name doctorName,
                r.ward, r.roomNumber, r.bedNumber, r.roomType,
                COALESCE(SUM(ac.quantity * ac.unitPrice - ac.discount), 0) chargeTotal
         FROM admission a JOIN patient p ON p.id = a.patientId
         LEFT JOIN doctor d ON d.id = a.doctorId LEFT JOIN hospital_room r ON r.id = a.roomId
         LEFT JOIN admission_charge ac ON ac.admissionId = a.id
         WHERE a.hospitalId = ? GROUP BY a.id ORDER BY a.admittedAt DESC`,
        [hospital.id],
      ),
      this.db.query(
        'SELECT id, name, phone FROM patient ORDER BY name LIMIT 300',
      ),
      this.db.query(
        'SELECT id, name, specialization FROM doctor WHERE hospitalId = ? AND status = "Active"',
        [hospital.id],
      ),
    ]);
    return { hospital, rooms, admissions, patients, doctors };
  }

  async saveRoom(user: any, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    if (
      !body.ward ||
      !body.roomNumber ||
      !body.bedNumber ||
      Number(body.dailyRate) < 0
    )
      throw new BadRequestException('Ward, room, bed and rate are required.');
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO hospital_room
       (id, hospitalId, ward, roomNumber, bedNumber, roomType, dailyRate, nursingRatePerDay, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE', NOW(3), NOW(3))`,
      [
        id,
        hospital.id,
        body.ward,
        body.roomNumber,
        body.bedNumber,
        body.roomType || 'General',
        Number(body.dailyRate),
        Number(body.nursingRatePerDay || 0),
      ],
    );
    return { id };
  }

  async admitPatient(user: any, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const room = await this.db.queryOne<any>(
      `SELECT * FROM hospital_room WHERE id = ? AND hospitalId = ? AND status = 'AVAILABLE'`,
      [body.roomId, hospital.id],
    );
    if (!room) throw new BadRequestException('Selected bed is unavailable.');
    const patient = await this.db.queryOne<any>(
      'SELECT id FROM patient WHERE id = ?',
      [body.patientId],
    );
    if (!patient) throw new BadRequestException('Patient not found.');
    const id = uuidv4();
    const admissionNo = `IPD-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}`;
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO admission
         (id, admissionNo, patientId, hospitalId, doctorId, roomId, status, admissionType,
          diagnosis, admittedAt, expectedDischargeAt, depositAmount, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'ADMITTED', 'IPD', ?, NOW(3), ?, ?, NOW(3), NOW(3))`,
        [
          id,
          admissionNo,
          body.patientId,
          hospital.id,
          body.doctorId || null,
          room.id,
          body.diagnosis || null,
          body.expectedDischargeAt || null,
          Number(body.depositAmount || 0),
        ],
      );
      await connection.execute(
        `UPDATE hospital_room SET status = 'OCCUPIED', updatedAt = NOW(3) WHERE id = ?`,
        [room.id],
      );
      if (Number(body.depositAmount || 0) > 0)
        await connection.execute(
          `INSERT INTO admission_charge
           (id, admissionId, category, description, serviceDate, quantity, unitPrice, discount, taxRate, sourceType, createdBy, createdAt)
           VALUES (?, ?, 'Deposit', 'Admission advance (credit)', NOW(3), -1, ?, 0, 0, 'DEPOSIT', ?, NOW(3))`,
          [uuidv4(), id, Number(body.depositAmount), user.sub || null],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    await this.notifyPatient(
      body.patientId,
      'ADMISSION',
      'Hospital admission registered',
      `${admissionNo} · ${hospital.name}`,
      '/patient/records',
    );
    return { id, admissionNo };
  }

  async addAdmissionCharge(user: any, admissionId: string, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const admission = await this.db.queryOne<any>(
      `SELECT id FROM admission WHERE id = ? AND hospitalId = ? AND status = 'ADMITTED'`,
      [admissionId, hospital.id],
    );
    if (!admission) throw new NotFoundException('Active admission not found.');
    if (
      !body.description ||
      Number(body.quantity || 1) <= 0 ||
      Number(body.unitPrice) < 0
    )
      throw new BadRequestException(
        'Description, quantity and price are required.',
      );
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO admission_charge
       (id, admissionId, category, description, serviceDate, quantity, unitPrice,
        discount, taxRate, sourceType, sourceId, createdBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        id,
        admissionId,
        body.category || 'Other',
        body.description,
        body.serviceDate ? new Date(body.serviceDate) : new Date(),
        Number(body.quantity || 1),
        Number(body.unitPrice),
        Number(body.discount || 0),
        Number(body.taxRate || 0),
        body.sourceType || null,
        body.sourceId || null,
        user.sub || null,
      ],
    );
    return { id };
  }

  async dischargePatient(user: any, admissionId: string, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const admission = await this.db.queryOne<any>(
      `SELECT a.*, p.name patientName, r.dailyRate, r.nursingRatePerDay
       FROM admission a JOIN patient p ON p.id = a.patientId
       LEFT JOIN hospital_room r ON r.id = a.roomId
       WHERE a.id = ? AND a.hospitalId = ? AND a.status = 'ADMITTED'`,
      [admissionId, hospital.id],
    );
    if (!admission) throw new NotFoundException('Active admission not found.');
    if (!body.finalDiagnosis)
      throw new BadRequestException('Final diagnosis is required.');
    const days = Math.max(
      1,
      Math.ceil(
        (Date.now() - new Date(admission.admittedAt).getTime()) / 86400000,
      ),
    );
    const charges = await this.db.query<any>(
      'SELECT * FROM admission_charge WHERE admissionId = ? AND category <> "Deposit"',
      [admissionId],
    );
    const items = [
      {
        name: `${admission.roomType || 'Room'} room charges`,
        category: 'Room & Nursing',
        quantity: days,
        unitPrice: Number(admission.dailyRate || 0),
        sourceType: 'ADMISSION',
        sourceId: admissionId,
      },
      {
        name: 'Nursing care',
        category: 'Room & Nursing',
        quantity: days,
        unitPrice: Number(admission.nursingRatePerDay || 0),
        sourceType: 'ADMISSION',
        sourceId: admissionId,
      },
      ...charges.map((charge) => ({
        name: charge.description,
        category: charge.category,
        quantity: Number(charge.quantity),
        unitPrice: Number(charge.unitPrice),
        discount: Number(charge.discount),
        taxRate: Number(charge.taxRate),
        sourceType: charge.sourceType || 'ADMISSION_CHARGE',
        sourceId: charge.id,
      })),
    ].filter((item) => item.unitPrice || item.quantity);
    const claim = admission.insuranceClaimId
      ? await this.db.queryOne<any>(
          'SELECT * FROM insurance_claim WHERE id = ?',
          [admission.insuranceClaimId],
        )
      : null;
    const invoiceId = await this.createAutomaticInvoice({
      patientId: admission.patientId,
      facilityId: hospital.id,
      facilityName: hospital.name,
      facilityType: 'HOSPITAL',
      encounterType: 'IPD',
      admissionId,
      claimId: claim?.id,
      insuranceDeduction: Number(claim?.approvedAmount || 0),
      depositAdjusted: Number(admission.depositAmount || 0),
      items,
    });
    const summaryId = uuidv4();
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO discharge_summary
         (id, admissionId, finalDiagnosis, clinicalCourse, proceduresPerformed,
          conditionAtDischarge, dischargeMedicines, followUpInstructions, followUpDate,
          preparedBy, finalizedAt, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3), NOW(3))`,
        [
          summaryId,
          admissionId,
          body.finalDiagnosis,
          body.clinicalCourse || null,
          body.proceduresPerformed || null,
          body.conditionAtDischarge || null,
          body.dischargeMedicines || null,
          body.followUpInstructions || null,
          body.followUpDate || null,
          user.email,
        ],
      );
      await connection.execute(
        `UPDATE admission SET status = 'DISCHARGED', dischargedAt = NOW(3),
         finalInvoiceId = ?, updatedAt = NOW(3) WHERE id = ?`,
        [invoiceId, admissionId],
      );
      if (admission.roomId)
        await connection.execute(
          `UPDATE hospital_room SET status = 'AVAILABLE', updatedAt = NOW(3) WHERE id = ?`,
          [admission.roomId],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    await this.issueDocument(
      'DISCHARGE_SUMMARY',
      'discharge_summary',
      summaryId,
      admission.patientId,
      hospital.id,
      body.signerName || user.email,
      body.signerRegistrationNo || null,
    );
    await this.notifyPatient(
      admission.patientId,
      'DISCHARGE',
      'Discharge completed',
      `Final bill and discharge summary from ${hospital.name} are ready.`,
      '/patient/billing',
    );
    return { summaryId, invoiceId };
  }

  async insuranceWorkspace(user: any) {
    const role = this.role(user);
    if (role.includes('PATIENT')) {
      const patient = await this.patient(user);
      const [policies, claims] = await Promise.all([
        this.db.query(
          'SELECT * FROM insurance_policy WHERE patientId = ? ORDER BY isPrimary DESC, validUntil DESC',
          [patient.id],
        ),
        this.db.query(
          `SELECT c.*, p.insurerName, p.policyNumber, h.name hospitalName
           FROM insurance_claim c JOIN insurance_policy p ON p.id = c.policyId
           JOIN hospital h ON h.id = c.hospitalId WHERE c.patientId = ? ORDER BY c.createdAt DESC`,
          [patient.id],
        ),
      ]);
      const documents = claims.length
        ? await this.db.query(
            `SELECT * FROM claim_document
             WHERE claimId IN (${claims.map(() => '?').join(',')})
             ORDER BY createdAt DESC`,
            claims.map((claim) => claim.id),
          )
        : [];
      return {
        viewer: 'PATIENT',
        patients: [patient],
        policies,
        claims,
        documents,
      };
    }
    const facility = await this.facility(user, ['HOSPITAL']);
    const [patients, policies, claims, admissions] = await Promise.all([
      this.db.query(
        'SELECT id, name, phone, email FROM patient ORDER BY name LIMIT 300',
      ),
      this.db.query(
        `SELECT ip.*, p.name patientName FROM insurance_policy ip
         JOIN patient p ON p.id = ip.patientId ORDER BY ip.updatedAt DESC`,
      ),
      this.db.query(
        `SELECT c.*, p.name patientName, ip.insurerName, ip.policyNumber
         FROM insurance_claim c JOIN patient p ON p.id = c.patientId
         JOIN insurance_policy ip ON ip.id = c.policyId
         WHERE c.hospitalId = ? ORDER BY c.createdAt DESC`,
        [facility.id],
      ),
      this.db.query(
        `SELECT a.id, a.admissionNo, a.patientId, p.name patientName
         FROM admission a JOIN patient p ON p.id = a.patientId
         WHERE a.hospitalId = ? ORDER BY a.admittedAt DESC`,
        [facility.id],
      ),
    ]);
    const documents = claims.length
      ? await this.db.query(
          `SELECT * FROM claim_document
           WHERE claimId IN (${claims.map(() => '?').join(',')})
           ORDER BY createdAt DESC`,
          claims.map((claim) => claim.id),
        )
      : [];
    return {
      viewer: 'HOSPITAL',
      facility,
      patients,
      policies,
      claims,
      admissions,
      documents,
    };
  }

  async savePolicy(user: any, body: any) {
    const patient = this.role(user).includes('PATIENT')
      ? await this.patient(user)
      : await this.db.queryOne<any>('SELECT * FROM patient WHERE id = ?', [
          body.patientId,
        ]);
    if (
      !patient ||
      !body.insurerName ||
      !body.policyNumber ||
      !body.validFrom ||
      !body.validUntil
    )
      throw new BadRequestException(
        'Patient, insurer, policy number and validity are required.',
      );
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO insurance_policy
       (id, patientId, insurerName, tpaName, policyNumber, memberId, planName,
        coverageAmount, validFrom, validUntil, status, isPrimary, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, NOW(3), NOW(3))`,
      [
        id,
        patient.id,
        body.insurerName,
        body.tpaName || null,
        body.policyNumber,
        body.memberId || null,
        body.planName || null,
        Number(body.coverageAmount || 0),
        body.validFrom,
        body.validUntil,
        body.isPrimary ? 1 : 0,
      ],
    );
    return { id };
  }

  async createClaim(user: any, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const policy = await this.db.queryOne<any>(
      'SELECT * FROM insurance_policy WHERE id = ? AND patientId = ?',
      [body.policyId, body.patientId],
    );
    if (!policy)
      throw new BadRequestException('Valid patient policy is required.');
    const id = uuidv4();
    const claimNumber = `CLM-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
    await this.db.query(
      `INSERT INTO insurance_claim
       (id, claimNumber, policyId, patientId, hospitalId, admissionId, invoiceId,
        claimType, status, requestedAmount, approvedAmount, rejectedAmount,
        patientPayable, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, 0, 0, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        claimNumber,
        policy.id,
        body.patientId,
        hospital.id,
        body.admissionId || null,
        body.invoiceId || null,
        body.claimType || 'CASHLESS',
        Number(body.requestedAmount || 0),
        Number(body.requestedAmount || 0),
        body.notes || null,
      ],
    );
    if (body.admissionId)
      await this.db.query(
        'UPDATE admission SET insuranceClaimId = ?, updatedAt = NOW(3) WHERE id = ? AND hospitalId = ?',
        [id, body.admissionId, hospital.id],
      );
    await this.notifyPatient(
      body.patientId,
      'INSURANCE',
      'Insurance claim initiated',
      `${claimNumber} with ${policy.insurerName}.`,
      '/patient/insurance',
    );
    return { id, claimNumber };
  }

  async updateClaim(user: any, id: string, body: any) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const claim = await this.db.queryOne<any>(
      'SELECT * FROM insurance_claim WHERE id = ? AND hospitalId = ?',
      [id, hospital.id],
    );
    if (!claim) throw new NotFoundException('Claim not found.');
    const status = String(body.status || claim.status).toUpperCase();
    const allowed = [
      'DRAFT',
      'SUBMITTED',
      'QUERY_RAISED',
      'PRE_AUTHORIZED',
      'PARTIALLY_APPROVED',
      'APPROVED',
      'REJECTED',
      'SETTLED',
    ];
    if (!allowed.includes(status))
      throw new BadRequestException('Invalid claim status.');
    const requested = Number(claim.requestedAmount);
    const approved = Math.max(
      0,
      Math.min(Number(body.approvedAmount ?? claim.approvedAmount), requested),
    );
    const rejected =
      status === 'REJECTED' ? requested : Math.max(0, requested - approved);
    const payable = Math.max(0, requested - approved);
    await this.db.query(
      `UPDATE insurance_claim SET status = ?, approvedAmount = ?, rejectedAmount = ?,
       patientPayable = ?, authorizationNumber = ?, rejectionReason = ?, notes = ?,
       submittedAt = IF(? = 'SUBMITTED', COALESCE(submittedAt, NOW(3)), submittedAt),
       decidedAt = IF(? IN ('APPROVED','PARTIALLY_APPROVED','REJECTED'), NOW(3), decidedAt),
       updatedAt = NOW(3) WHERE id = ?`,
      [
        status,
        approved,
        rejected,
        payable,
        body.authorizationNumber || claim.authorizationNumber,
        body.rejectionReason || null,
        body.notes || claim.notes,
        status,
        status,
        id,
      ],
    );
    await this.notifyPatient(
      claim.patientId,
      'INSURANCE',
      `Claim ${status.toLowerCase().replaceAll('_', ' ')}`,
      `${claim.claimNumber}: approved ₹${approved.toFixed(2)}, patient payable ₹${payable.toFixed(2)}.`,
      '/patient/insurance',
    );
    return { status, approvedAmount: approved, patientPayable: payable };
  }

  async uploadClaimDocument(
    user: any,
    claimId: string,
    documentType: string,
    file?: Express.Multer.File,
  ) {
    const hospital = await this.facility(user, ['HOSPITAL']);
    const claim = await this.db.queryOne<any>(
      'SELECT id FROM insurance_claim WHERE id = ? AND hospitalId = ?',
      [claimId, hospital.id],
    );
    if (!claim) throw new NotFoundException('Claim not found.');
    if (!file)
      throw new BadRequestException('Claim document file is required.');
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype))
      throw new BadRequestException(
        'Only PDF, JPG and PNG claim documents are allowed.',
      );
    const safeType = String(documentType || 'OTHER')
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '_');
    const id = uuidv4();
    const extension = extname(file.originalname).toLowerCase() || '.bin';
    const relativeDirectory = join('claims', claimId);
    const absoluteDirectory = join(process.cwd(), 'uploads', relativeDirectory);
    await mkdir(absoluteDirectory, { recursive: true });
    const storedName = `${id}${extension}`;
    await writeFile(join(absoluteDirectory, storedName), file.buffer);
    const storagePath = `/uploads/${relativeDirectory.replaceAll('\\', '/')}/${storedName}`;
    const fileHash = createHash('sha256').update(file.buffer).digest('hex');
    await this.db.query(
      `INSERT INTO claim_document
       (id, claimId, documentType, fileName, mimeType, storagePath, fileHash, uploadedBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        id,
        claimId,
        safeType,
        file.originalname,
        file.mimetype,
        storagePath,
        fileHash,
        user.sub || null,
      ],
    );
    return { id, storagePath, fileHash };
  }

  private async createAutomaticInvoice(input: any) {
    const normalizedItems = input.items.map((item) => {
      const base = Number(item.quantity || 1) * Number(item.unitPrice || 0);
      const discount = Number(item.discount || 0);
      const taxRate = Number(item.taxRate || 0);
      const taxAmount = ((base - discount) * taxRate) / 100;
      return {
        ...item,
        discount,
        taxRate,
        taxAmount,
        lineTotal: base - discount + taxAmount,
      };
    });
    const subtotal = normalizedItems.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 1) * Number(item.unitPrice || 0),
      0,
    );
    const discount = normalizedItems.reduce(
      (sum, item) => sum + item.discount,
      0,
    );
    const tax = normalizedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const gross = subtotal - discount + tax;
    const insurance = Math.min(Number(input.insuranceDeduction || 0), gross);
    const deposit = Math.min(
      Number(input.depositAdjusted || 0),
      gross - insurance,
    );
    const payable = Math.max(0, gross - insurance - deposit);
    const id = uuidv4();
    const invoiceNo = `${String(input.facilityType).slice(0, 3)}-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO billing_invoice
         (id, invoiceNo, patientId, facilityId, facilityType, facilityName, encounterType,
          appointmentId, admissionId, claimId, status, subtotal, discountTotal, taxTotal,
          insuranceDeduction, depositAdjusted, totalAmount, amountPaid, patientPayable,
          createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
        [
          id,
          invoiceNo,
          input.patientId,
          input.facilityId,
          input.facilityType,
          input.facilityName,
          input.encounterType || 'OPD',
          input.appointmentId || null,
          input.admissionId || null,
          input.claimId || null,
          payable === 0 ? 'PAID' : 'PENDING',
          subtotal,
          discount,
          tax,
          insurance,
          deposit,
          gross,
          deposit,
          payable,
        ],
      );
      for (const item of normalizedItems)
        await connection.execute(
          `INSERT INTO billing_invoice_item
           (id, invoiceId, catalogItemId, sourceType, sourceId, name, category, serviceDate,
            quantity, unitPrice, discount, taxRate, taxAmount, lineTotal, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), ?, ?, ?, ?, ?, ?, NOW(3))`,
          [
            uuidv4(),
            id,
            item.catalogItemId || null,
            item.sourceType || null,
            item.sourceId || null,
            item.name,
            item.category,
            Number(item.quantity || 1),
            Number(item.unitPrice || 0),
            item.discount,
            item.taxRate,
            item.taxAmount,
            item.lineTotal,
          ],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    await this.issueDocument(
      'INVOICE',
      'billing_invoice',
      id,
      input.patientId,
      input.facilityId,
      input.facilityName,
      null,
    );
    await this.notifyPatient(
      input.patientId,
      'INVOICE',
      'New itemized bill',
      `${invoiceNo} · ₹${payable.toFixed(2)} payable.`,
      '/patient/billing',
    );
    return id;
  }

  private async issueDocument(
    type: string,
    entityType: string,
    entityId: string,
    patientId: string | null,
    facilityId: string | null,
    signerName: string | null,
    signerRegistrationNo: string | null,
  ) {
    const existing = await this.db.queryOne<any>(
      'SELECT id FROM digital_document WHERE documentType = ? AND entityType = ? AND entityId = ? AND revokedAt IS NULL',
      [type, entityType, entityId],
    );
    if (existing) return existing.id;
    const id = uuidv4();
    const token = randomBytes(32).toString('hex');
    const documentNo = `DOC-${new Date().getFullYear()}-${Date.now().toString().slice(-9)}`;
    const hash = createHash('sha256')
      .update(`${type}:${entityType}:${entityId}:${patientId}:${facilityId}`)
      .digest('hex');
    const signature = this.documentSignature(hash);
    await this.db.query(
      `INSERT INTO digital_document
       (id, documentNo, documentType, entityType, entityId, patientId, facilityId,
        verificationToken, contentHash, signerName, signerRegistrationNo, signatureText,
        issuedAt, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        documentNo,
        type,
        entityType,
        entityId,
        patientId,
        facilityId,
        token,
        hash,
        signerName,
        signerRegistrationNo,
        signature,
      ],
    );
    return id;
  }

  async documentPdf(user: any, type: string, entityId: string) {
    const normalized = type.toUpperCase();
    let payload: any;
    if (normalized === 'INVOICE') {
      payload = await this.db.queryOne<any>(
        `SELECT bi.*, p.name patientName, p.phone patientPhone
         FROM billing_invoice bi JOIN patient p ON p.id = bi.patientId WHERE bi.id = ?`,
        [entityId],
      );
      if (payload)
        payload.items = await this.db.query<any>(
          'SELECT * FROM billing_invoice_item WHERE invoiceId = ? ORDER BY createdAt, name',
          [entityId],
        );
    } else if (normalized === 'PRESCRIPTION') {
      payload = await this.db.queryOne<any>(
        `SELECT pr.*, p.name patientName, d.name doctorName, d.registrationNo, h.name facilityName
         FROM prescription pr JOIN patient p ON p.id = pr.patientId
         LEFT JOIN doctor d ON d.id = pr.doctorId LEFT JOIN hospital h ON h.id = pr.hospitalId
         WHERE pr.id = ?`,
        [entityId],
      );
    } else if (normalized === 'LAB_REPORT') {
      payload = await this.db.queryOne<any>(
        `SELECT mr.*, p.name patientName, h.name facilityName
         FROM medicalrecord mr JOIN patient p ON p.id = mr.patientId
         LEFT JOIN hospital h ON h.id = mr.hospitalId WHERE mr.id = ?`,
        [entityId],
      );
    } else if (normalized === 'DISCHARGE_SUMMARY') {
      payload = await this.db.queryOne<any>(
        `SELECT ds.*, a.admissionNo, a.patientId, p.name patientName, h.name facilityName,
                d.name doctorName, d.registrationNo
         FROM discharge_summary ds JOIN admission a ON a.id = ds.admissionId
         JOIN patient p ON p.id = a.patientId JOIN hospital h ON h.id = a.hospitalId
         LEFT JOIN doctor d ON d.id = a.doctorId WHERE ds.id = ?`,
        [entityId],
      );
    } else throw new BadRequestException('Unsupported document type.');
    if (!payload) throw new NotFoundException('Document source not found.');
    if (this.role(user).includes('PATIENT')) {
      const patient = await this.patient(user);
      if (payload.patientId !== patient.id)
        throw new ForbiddenException('This document does not belong to you.');
    } else if (
      ['HOSPITAL', 'CLINIC', 'DOCTOR', 'LAB'].some((role) =>
        this.role(user).includes(role),
      )
    ) {
      const facility = await this.facility(user);
      const documentFacilityId = payload.facilityId || payload.hospitalId;
      if (documentFacilityId && documentFacilityId !== facility.id)
        throw new ForbiddenException(
          'This document belongs to another facility.',
        );
    }
    const document = await this.db.queryOne<any>(
      `SELECT * FROM digital_document WHERE documentType = ? AND entityId = ? AND revokedAt IS NULL`,
      [normalized, entityId],
    );
    const issuedDocument =
      document ||
      (await (async () => {
        await this.issueDocument(
          normalized,
          normalized === 'INVOICE'
            ? 'billing_invoice'
            : normalized.toLowerCase(),
          entityId,
          payload.patientId,
          payload.facilityId || payload.hospitalId,
          payload.doctorName || payload.facilityName || user.email,
          payload.registrationNo || null,
        );
        return this.db.queryOne<any>(
          `SELECT * FROM digital_document WHERE documentType = ? AND entityId = ? AND revokedAt IS NULL`,
          [normalized, entityId],
        );
      })());
    const expectedSignature = this.documentSignature(
      issuedDocument.contentHash,
    );
    if (issuedDocument.signatureText !== expectedSignature) {
      await this.db.query(
        'UPDATE digital_document SET signatureText = ?, updatedAt = NOW(3) WHERE id = ?',
        [expectedSignature, issuedDocument.id],
      );
      issuedDocument.signatureText = expectedSignature;
    }
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${issuedDocument.verificationToken}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 180,
      margin: 1,
    });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const content = await this.renderPdf(
      normalized,
      payload,
      issuedDocument,
      qrBuffer,
    );
    return {
      content,
      fileName: `${normalized.toLowerCase()}-${issuedDocument.documentNo}.pdf`,
    };
  }

  async verifyDocument(token: string) {
    const document = await this.db.queryOne<any>(
      `SELECT dd.*, p.name patientName, h.name facilityName
       FROM digital_document dd LEFT JOIN patient p ON p.id = dd.patientId
       LEFT JOIN hospital h ON h.id = dd.facilityId WHERE dd.verificationToken = ?`,
      [token],
    );
    if (!document)
      throw new NotFoundException('Document verification token is invalid.');
    const signatureValid =
      document.signatureText === this.documentSignature(document.contentHash);
    return {
      valid: !document.revokedAt && signatureValid,
      signatureValid,
      documentNo: document.documentNo,
      documentType: document.documentType,
      patientName: document.patientName,
      facilityName: document.facilityName,
      signerName: document.signerName,
      signerRegistrationNo: document.signerRegistrationNo,
      issuedAt: document.issuedAt,
      revokedAt: document.revokedAt,
      contentHash: document.contentHash,
    };
  }

  private documentSignature(contentHash: string) {
    return createHmac(
      'sha256',
      process.env.DOCUMENT_SIGNING_SECRET ||
        process.env.JWT_SECRET ||
        'local-development-document-key',
    )
      .update(contentHash)
      .digest('base64url');
  }

  private renderPdf(type: string, payload: any, documentRow: any, qr: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      const pdf = new PDFDocument({
        size: 'A4',
        margin: 48,
        info: { Title: `${type} ${documentRow.documentNo}` },
      });
      const chunks: Buffer[] = [];
      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', () => resolve(Buffer.concat(chunks)));
      pdf.on('error', reject);
      pdf
        .fontSize(10)
        .fillColor('#0891b2')
        .text('MEDICALDOCS', { characterSpacing: 2 });
      pdf
        .fontSize(22)
        .fillColor('#0f172a')
        .text(type.replaceAll('_', ' '), { align: 'left' });
      pdf
        .fontSize(9)
        .fillColor('#64748b')
        .text(
          `${documentRow.documentNo} · Issued ${new Date(documentRow.issuedAt).toLocaleString('en-IN')}`,
        );
      pdf.moveDown();
      pdf.strokeColor('#cbd5e1').moveTo(48, pdf.y).lineTo(547, pdf.y).stroke();
      pdf.moveDown();
      pdf.fontSize(11).fillColor('#0f172a');
      pdf.text(`Patient: ${payload.patientName || '—'}`);
      pdf.text(
        `Facility: ${payload.facilityName || payload.facilityName || '—'}`,
      );
      if (type === 'INVOICE') {
        pdf.text(`Invoice: ${payload.invoiceNo}`);
        pdf.moveDown();
        pdf.font('Helvetica-Bold').text('Itemized charges');
        pdf.font('Helvetica');
        for (const item of payload.items || []) {
          pdf.text(
            `${item.name} (${Number(item.quantity)} × ₹${Number(item.unitPrice).toFixed(2)})`,
            { continued: true },
          );
          pdf.text(`₹${Number(item.lineTotal).toFixed(2)}`, { align: 'right' });
        }
        pdf.moveDown();
        pdf
          .font('Helvetica-Bold')
          .text(`Gross total: ₹${Number(payload.totalAmount).toFixed(2)}`, {
            align: 'right',
          });
        pdf.text(
          `Insurance/TPA: -₹${Number(payload.insuranceDeduction || 0).toFixed(2)}`,
          { align: 'right' },
        );
        pdf.text(
          `Deposit adjusted: -₹${Number(payload.depositAdjusted || 0).toFixed(2)}`,
          { align: 'right' },
        );
        pdf
          .fontSize(14)
          .text(
            `Patient payable: ₹${Number(payload.patientPayable ?? payload.totalAmount).toFixed(2)}`,
            { align: 'right' },
          );
      } else {
        const fields =
          type === 'PRESCRIPTION'
            ? [
                ['Diagnosis', payload.diagnosis],
                ['Medicine', payload.medicine],
                ['Dosage', payload.dosage],
                ['Duration', payload.duration],
                ['Instructions', payload.instructions],
              ]
            : type === 'LAB_REPORT'
              ? [
                  ['Report', payload.title],
                  ['Result summary', payload.description],
                  ['Category', payload.category],
                ]
              : [
                  ['Final diagnosis', payload.finalDiagnosis],
                  ['Clinical course', payload.clinicalCourse],
                  ['Procedures', payload.proceduresPerformed],
                  ['Condition at discharge', payload.conditionAtDischarge],
                  ['Medicines', payload.dischargeMedicines],
                  ['Follow-up', payload.followUpInstructions],
                ];
        for (const [label, value] of fields) {
          if (!value) continue;
          pdf.moveDown(0.6).font('Helvetica-Bold').text(label);
          pdf.font('Helvetica').fillColor('#334155').text(String(value));
        }
      }
      const footerY = 680;
      pdf.image(qr, 48, footerY, { width: 92 });
      pdf
        .fontSize(8)
        .fillColor('#64748b')
        .text('Scan to verify this document', 150, footerY + 18);
      pdf.text(`SHA-256: ${documentRow.contentHash}`, 150, footerY + 34, {
        width: 360,
      });
      if (documentRow.signatureText)
        pdf
          .fontSize(9)
          .fillColor('#0f172a')
          .text(documentRow.signatureText, 150, footerY + 66);
      pdf.end();
    });
  }

  private escapeXml(value: unknown) {
    let normalized = '';
    if (typeof value === 'string') normalized = value;
    else if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    )
      normalized = `${value}`;
    else if (value !== null && value !== undefined)
      normalized = JSON.stringify(value) || '';
    return normalized
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
