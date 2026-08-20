import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';
import { formatPrescriptionId } from '../prescription-id';

@Injectable()
export class PharmacyService {
  constructor(private readonly db: MysqlService) {}

  private async getPharmacy(userEmail: string) {
    const pharmacy = await this.db.queryOne<any>(
      `SELECT h.id, h.name, u.id AS userId
       FROM user u
       JOIN hospital h ON h.id = u.hospitalId
       WHERE LOWER(u.email) = LOWER(?) AND UPPER(h.type) = 'PHARMACY'
       LIMIT 1`,
      [userEmail],
    );
    if (!pharmacy) throw new NotFoundException('Pharmacy account not found.');
    return pharmacy;
  }

  async getPrescriptionRequests(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);

    const requests = await this.db.query<any>(
      `SELECT r.id, r.requestGroupId, r.prescriptionReference AS prescription,
              COALESCE(NULLIF(TRIM(p.address), ''), NULLIF(TRIM(r.deliveryAddress), ''), 'Address on record') AS location,
              r.requestNote, r.status,
              r.createdAt, p.id AS patientId, p.name AS patient, p.phone,
              COALESCE(NULLIF(TRIM(p.address), ''), NULLIF(TRIM(r.deliveryAddress), ''), 'Address on record') AS patientAddress,
              COALESCE(NULLIF(TRIM(d.name), ''), NULLIF(TRIM(mr.description), ''), 'Prescribing Doctor') AS doctorName,
              COALESCE(NULLIF(TRIM(fac.name), ''), NULLIF(TRIM(mrh.name), ''), 'Healthcare Facility') AS facilityName,
              COALESCE(fac.type, mrh.type, 'HOSPITAL') AS facilityType
       FROM pharmacy_prescription_request r
       JOIN patient p ON p.id = r.patientId
       LEFT JOIN prescription rx ON rx.id = r.prescriptionReference AND rx.patientId = r.patientId
       LEFT JOIN doctor d ON d.id = rx.doctorId
       LEFT JOIN hospital fac ON fac.id = rx.hospitalId
       LEFT JOIN medicalrecord mr ON (mr.id = r.prescriptionReference OR mr.title = r.prescriptionReference) AND mr.patientId = r.patientId
       LEFT JOIN hospital mrh ON mrh.id = mr.hospitalId
       WHERE r.pharmacyId = ?
       ORDER BY r.createdAt DESC`,
      [pharmacy.id],
    );
    return requests.map((request) => ({
      ...request,
      prescriptionReference: request.prescription,
      prescription: formatPrescriptionId(request.prescription),
    }));
  }

  async getPrescriptionRequest(userEmail: string, id: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const request = await this.db.queryOne<any>(
      `SELECT r.*, p.name AS patient, p.phone, p.email,
              COALESCE(NULLIF(TRIM(p.address), ''), NULLIF(TRIM(r.deliveryAddress), ''), 'Address on record') AS patientAddress,
              ph.name AS pharmacyName, ph.address AS pharmacyAddress,
              COALESCE(NULLIF(TRIM(d.name), ''), NULLIF(TRIM(mr.description), ''), 'Prescribing Doctor') AS doctorName,
              COALESCE(NULLIF(TRIM(fac.name), ''), NULLIF(TRIM(mrh.name), ''), 'Healthcare Facility') AS facilityName,
              COALESCE(fac.type, mrh.type, 'HOSPITAL') AS facilityType,
              rx.id AS prescriptionId, rx.medicine, rx.dosage, rx.duration,
              mr.fileUrl AS prescriptionFileUrl,
              q.id AS quotationId, q.status AS quotationStatus
       FROM pharmacy_prescription_request r
       JOIN patient p ON p.id = r.patientId
       LEFT JOIN hospital ph ON ph.id = r.pharmacyId
       LEFT JOIN prescription rx ON rx.id = r.prescriptionReference AND rx.patientId = r.patientId
       LEFT JOIN doctor d ON d.id = rx.doctorId
       LEFT JOIN hospital fac ON fac.id = rx.hospitalId
       LEFT JOIN medicalrecord mr ON (mr.id = r.prescriptionReference OR mr.title = r.prescriptionReference) AND mr.patientId = r.patientId
       LEFT JOIN hospital mrh ON mrh.id = mr.hospitalId
       LEFT JOIN pharmacy_quotation q ON q.requestId = r.id
       WHERE (r.id = ? OR r.requestGroupId = ?) AND r.pharmacyId = ? LIMIT 1`,
      [id, id, pharmacy.id],
    );
    if (!request) throw new NotFoundException('Prescription request not found.');
    return {
      ...request,
      prescriptionDisplayId: formatPrescriptionId(request.prescriptionReference),
    };
  }

  async saveQuotation(userEmail: string, requestId: string, data: any) {
    const pharmacy = await this.getPharmacy(userEmail);
    const request = await this.db.queryOne<any>(
      'SELECT * FROM pharmacy_prescription_request WHERE (id = ? OR requestGroupId = ?) AND pharmacyId = ? LIMIT 1',
      [requestId, requestId, pharmacy.id],
    );
    if (!request) throw new NotFoundException('Prescription request not found.');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) throw new BadRequestException('At least one medicine is required.');
    const normalizedItems = items.map((item: any) => ({
      inventoryItemId: item.inventoryItemId || null,
      prescribedMedicineName: String(item.prescribedMedicineName || item.medicineName || '').trim(),
      medicineName: String(item.medicineName || '').trim(),
      isAlternative: Boolean(item.isAlternative),
      alternativeName: item.isAlternative ? String(item.alternativeName || item.medicineName || '').trim() : null,
      alternativeBrand: item.isAlternative ? String(item.alternativeBrand || '').trim() : null,
      alternativeComposition: item.isAlternative ? String(item.alternativeComposition || '').trim() : null,
      quantity: Math.max(1, Number(item.quantity || 1)),
      unitPrice: Math.max(0, Number(item.unitPrice || 0)),
      available: item.available !== false,
    }));
    if (normalizedItems.some((item: any) => !item.medicineName)) throw new BadRequestException('Medicine name is required.');
    const subtotal = normalizedItems.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const discount = Math.max(0, Number(data.discountAmount || 0));
    const tax = Math.max(0, Number(data.taxAmount || 0));
    const delivery = Math.max(0, Number(data.deliveryCharge || 0));
    const total = Math.max(0, subtotal - discount + tax + delivery);
    const status = String(data.status || 'DRAFT').toUpperCase() === 'SENT' ? 'SENT' : 'DRAFT';
    const existing = await this.db.queryOne<any>('SELECT id FROM pharmacy_quotation WHERE requestId = ?', [request.id]);
    const id = existing?.id || `QUO-${Date.now()}`;
    await this.db.query(
      `INSERT INTO pharmacy_quotation
       (id, requestId, requestGroupId, patientId, pharmacyId, itemsJson, subtotal,
        discountAmount, taxAmount, deliveryCharge, totalAmount, notes, status,
        validUntil, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(3), INTERVAL 6 HOUR), NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE itemsJson=VALUES(itemsJson), subtotal=VALUES(subtotal),
        discountAmount=VALUES(discountAmount), taxAmount=VALUES(taxAmount),
        deliveryCharge=VALUES(deliveryCharge), totalAmount=VALUES(totalAmount),
        notes=VALUES(notes), status=VALUES(status), validUntil=VALUES(validUntil), updatedAt=NOW(3)`,
      [id, request.id, request.requestGroupId, request.patientId, pharmacy.id, JSON.stringify(normalizedItems), subtotal, discount, tax, delivery, total, String(data.notes || ''), status],
    );
    await this.db.query('UPDATE pharmacy_prescription_request SET status = ?, updatedAt = NOW(3) WHERE id = ?', [status === 'SENT' ? 'QUOTATION_SENT' : 'VIEWED', request.id]);
    if (status === 'SENT') {
      try {
        const patientUsers = await this.db.query<any>(
          `SELECT u.id FROM user u
           LEFT JOIN patient p ON LOWER(p.email) = LOWER(u.email)
           WHERE p.id = ?`,
          [request.patientId],
        );
        const formattedAmount = `₹${total.toLocaleString('en-IN')}`;
        const etaText = String(data.estimatedDelivery || data.eta || '45–60 minutes');
        const notifTitle = `Quotation Received: ${pharmacy.name}`;
        const notifMessage = `${pharmacy.name} sent a quotation of ${formattedAmount} (Est. Delivery: ${etaText}).`;

        for (const u of patientUsers) {
          const notifId = uuidv4();
          await this.db.query(
            `INSERT INTO notification (id, userId, hospitalId, type, title, message, isRead, actionRequired, actionUrl, severity, createdAt, updatedAt)
             VALUES (?, ?, ?, 'PHARMACY_QUOTATION', ?, ?, false, true, ?, 'Low', NOW(3), NOW(3))`,
            [notifId, u.id, pharmacy.id, notifTitle, notifMessage, `/patient/prescriptions?viewQuotation=${encodeURIComponent(id)}`],
          );
        }
      } catch (err) {
        console.error('Failed to create quotation notification for patient:', err);
      }
    }
    return { id, status, totalAmount: total };
  }

  async getQuotations(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const rows = await this.db.query<any>(`SELECT q.*, p.name AS patient, r.prescriptionReference AS prescription FROM pharmacy_quotation q JOIN patient p ON p.id=q.patientId JOIN pharmacy_prescription_request r ON r.id=q.requestId WHERE q.pharmacyId=? ORDER BY q.createdAt DESC`, [pharmacy.id]);
    return rows.map((row) => ({
      ...row,
      rawPrescriptionReference: row.prescription,
      prescription: formatPrescriptionId(row.prescription),
    }));
  }

  async getOrders(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const rows = await this.db.query<any>(
      `SELECT o.*, p.name AS patient, p.phone AS patientPhone, p.address AS patientAddress,
              q.itemsJson, q.subtotal, q.discountAmount, q.taxAmount, q.deliveryCharge,
              q.notes AS pharmacyNotes, q.validUntil, q.requestGroupId,
              r.prescriptionReference AS prescription, r.deliveryAddress, r.requestNote,
              h.name AS pharmacyName
       FROM pharmacy_order o
       JOIN patient p ON p.id=o.patientId
       JOIN pharmacy_quotation q ON q.id=o.quotationId
       JOIN pharmacy_prescription_request r ON r.id=q.requestId
       JOIN hospital h ON h.id=o.pharmacyId
       WHERE o.pharmacyId=? ORDER BY o.createdAt DESC`,
      [pharmacy.id],
    );
    return rows.map((row) => ({
      ...row,
      rawPrescriptionReference: row.prescription,
      prescription: formatPrescriptionId(row.prescription),
      deliveryMode: Number(row.deliveryCharge || 0) > 0 ? 'Home delivery' : 'Store pickup',
    }));
  }

  async updateOrderStatus(userEmail: string, id: string, rawStatus: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const status = String(rawStatus || '').toUpperCase().replace(/\s+/g, '_');
    const order = await this.db.queryOne<any>(
      `SELECT o.status, q.deliveryCharge
       FROM pharmacy_order o
       JOIN pharmacy_quotation q ON q.id=o.quotationId
       WHERE o.id=? AND o.pharmacyId=? LIMIT 1`,
      [id, pharmacy.id],
    );
    if (!order) throw new NotFoundException('Order not found.');
    const isHomeDelivery = Number(order.deliveryCharge || 0) > 0;
    const sequence = isHomeDelivery
      ? ['CONFIRMED', 'PREPARING', 'READY_FOR_DISPATCH', 'OUT_FOR_DELIVERY', 'DELIVERED']
      : ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP'];
    const currentStatus = String(order.status || '').toUpperCase() === 'ACCEPTED'
      ? 'CONFIRMED'
      : String(order.status || '').toUpperCase();
    const currentIndex = sequence.indexOf(currentStatus);
    const requestedIndex = sequence.indexOf(status);
    if (currentIndex < 0 || requestedIndex !== currentIndex + 1) {
      throw new BadRequestException('Order status must be updated in the required delivery sequence.');
    }
    const result: any = await this.db.query('UPDATE pharmacy_order SET status=?, updatedAt=NOW(3) WHERE id=? AND pharmacyId=?', [status, id, pharmacy.id]);
    if (!Number(result?.affectedRows || 0)) throw new NotFoundException('Order not found.');
    return { id, status, deliveryMode: isHomeDelivery ? 'Home delivery' : 'Store pickup' };
  }

  async getInventory(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    return this.db.query('SELECT * FROM pharmacy_inventory_item WHERE pharmacyId=? ORDER BY medicineName', [pharmacy.id]);
  }

  async addInventoryItem(userEmail: string, data: any) {
    const pharmacy = await this.getPharmacy(userEmail);
    if (!String(data.medicineName || '').trim()) throw new BadRequestException('Medicine name is required.');
    const id = uuidv4();
    await this.db.query(`INSERT INTO pharmacy_inventory_item (id,pharmacyId,medicineName,batchNumber,stockQuantity,unitPrice,active,createdAt,updatedAt) VALUES (?,?,?,?,?,?,1,NOW(3),NOW(3))`, [id, pharmacy.id, String(data.medicineName).trim(), String(data.batchNumber || ''), Math.max(0, Number(data.stockQuantity || 0)), Math.max(0, Number(data.unitPrice || 0))]);
    return { id };
  }

  async getProfile(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const profile = await this.db.queryOne<any>(
      `SELECT h.id AS pharmacyId, h.name AS pharmacyName, h.email,
              h.phone AS contact, h.address, h.licenseNumber,
              hp.pharmacyOwnerName AS ownerName,
              hp.pharmacyGstNumber AS gstNumber,
              hp.pharmacyServiceAreas AS serviceAreas,
              hp.pharmacyDeliveryRadius AS deliveryRadius,
              hp.openingTime, hp.closingTime,
              hp.pharmacyMinimumOrder AS minimumOrder,
              hp.pharmacyHomeDelivery AS homeDelivery,
              hp.pharmacyStorePickup AS storePickup
       FROM hospital h
       LEFT JOIN hospital_profile hp ON hp.hospitalId = h.id
       WHERE h.id = ? LIMIT 1`,
      [pharmacy.id],
    );
    if (!profile) throw new NotFoundException('Pharmacy profile not found.');
    return profile;
  }

  async updateProfile(userEmail: string, data: any) {
    const pharmacy = await this.getPharmacy(userEmail);
    const pharmacyName = String(data.pharmacyName || '').trim();
    if (!pharmacyName) throw new BadRequestException('Pharmacy name is required.');
    const minimumOrder = data.minimumOrder === '' || data.minimumOrder == null
      ? null
      : Math.max(0, Number(data.minimumOrder));
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `UPDATE hospital SET name=?, phone=?, address=?, licenseNumber=?, updatedAt=NOW(3)
         WHERE id=? AND UPPER(type)='PHARMACY'`,
        [pharmacyName, String(data.contact || '').trim(), String(data.address || '').trim(), String(data.licenseNumber || '').trim() || null, pharmacy.id],
      );
      await connection.execute(
        `INSERT INTO hospital_profile
         (id, hospitalId, pharmacyOwnerName, pharmacyGstNumber,
          pharmacyServiceAreas, pharmacyDeliveryRadius, openingTime, closingTime,
          pharmacyMinimumOrder, pharmacyHomeDelivery, pharmacyStorePickup,
          createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE
          pharmacyOwnerName=VALUES(pharmacyOwnerName),
          pharmacyGstNumber=VALUES(pharmacyGstNumber),
          pharmacyServiceAreas=VALUES(pharmacyServiceAreas),
          pharmacyDeliveryRadius=VALUES(pharmacyDeliveryRadius),
          openingTime=VALUES(openingTime), closingTime=VALUES(closingTime),
          pharmacyMinimumOrder=VALUES(pharmacyMinimumOrder),
          pharmacyHomeDelivery=VALUES(pharmacyHomeDelivery),
          pharmacyStorePickup=VALUES(pharmacyStorePickup), updatedAt=NOW(3)`,
        [uuidv4(), pharmacy.id, String(data.ownerName || '').trim() || null, String(data.gstNumber || '').trim() || null, String(data.serviceAreas || '').trim() || null, String(data.deliveryRadius || '').trim() || null, String(data.openingTime || '').trim() || null, String(data.closingTime || '').trim() || null, minimumOrder, Boolean(data.homeDelivery), Boolean(data.storePickup)],
      );
      await connection.commit();
      return this.getProfile(userEmail);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getNotifications(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const notifications = await this.db.query<any>(
      `SELECT * FROM notification
       WHERE userId = ?
       ORDER BY createdAt DESC`,
      [pharmacy.userId],
    );
    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      actionUrl: n.actionUrl || '/pharmacy/prescription-requests',
      time: new Date(n.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      read: Boolean(n.isRead),
    }));
  }

  async markNotificationRead(userEmail: string, id: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const result: any = await this.db.query(
      `UPDATE notification SET isRead=1, updatedAt=NOW(3)
       WHERE id=? AND userId=?`,
      [id, pharmacy.userId],
    );
    if (!Number(result?.affectedRows || 0)) throw new NotFoundException('Notification not found.');
    return { id, read: true };
  }

  async markAllNotificationsRead(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    await this.db.query(
      'UPDATE notification SET isRead=1, updatedAt=NOW(3) WHERE userId=? AND isRead=0',
      [pharmacy.userId],
    );
    return { read: true };
  }
}
