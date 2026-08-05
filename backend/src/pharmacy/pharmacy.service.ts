import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PharmacyService {
  constructor(private readonly db: MysqlService) {}

  private async getPharmacy(userEmail: string) {
    const pharmacy = await this.db.queryOne<any>(
      `SELECT h.id, h.name
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

    return this.db.query(
      `SELECT r.id, r.requestGroupId, r.prescriptionReference AS prescription,
              r.deliveryAddress AS location, r.requestNote, r.status,
              r.createdAt, p.id AS patientId, p.name AS patient, p.phone
       FROM pharmacy_prescription_request r
       JOIN patient p ON p.id = r.patientId
       WHERE r.pharmacyId = ?
       ORDER BY r.createdAt DESC`,
      [pharmacy.id],
    );
  }

  async getPrescriptionRequest(userEmail: string, id: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const request = await this.db.queryOne<any>(
      `SELECT r.*, p.name AS patient, p.phone, p.email,
              q.id AS quotationId, q.status AS quotationStatus
       FROM pharmacy_prescription_request r
       JOIN patient p ON p.id = r.patientId
       LEFT JOIN pharmacy_quotation q ON q.requestId = r.id
       WHERE r.id = ? AND r.pharmacyId = ? LIMIT 1`,
      [id, pharmacy.id],
    );
    if (!request) throw new NotFoundException('Prescription request not found.');
    return request;
  }

  async saveQuotation(userEmail: string, requestId: string, data: any) {
    const pharmacy = await this.getPharmacy(userEmail);
    const request = await this.db.queryOne<any>(
      'SELECT * FROM pharmacy_prescription_request WHERE id = ? AND pharmacyId = ? LIMIT 1',
      [requestId, pharmacy.id],
    );
    if (!request) throw new NotFoundException('Prescription request not found.');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) throw new BadRequestException('At least one medicine is required.');
    const normalizedItems = items.map((item: any) => ({
      inventoryItemId: item.inventoryItemId || null,
      medicineName: String(item.medicineName || '').trim(),
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
    return { id, status, totalAmount: total };
  }

  async getQuotations(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    return this.db.query(`SELECT q.*, p.name AS patient, r.prescriptionReference AS prescription FROM pharmacy_quotation q JOIN patient p ON p.id=q.patientId JOIN pharmacy_prescription_request r ON r.id=q.requestId WHERE q.pharmacyId=? ORDER BY q.createdAt DESC`, [pharmacy.id]);
  }

  async getOrders(userEmail: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    return this.db.query(`SELECT o.*, p.name AS patient, q.itemsJson, r.prescriptionReference AS prescription FROM pharmacy_order o JOIN patient p ON p.id=o.patientId JOIN pharmacy_quotation q ON q.id=o.quotationId JOIN pharmacy_prescription_request r ON r.id=q.requestId WHERE o.pharmacyId=? ORDER BY o.createdAt DESC`, [pharmacy.id]);
  }

  async updateOrderStatus(userEmail: string, id: string, rawStatus: string) {
    const pharmacy = await this.getPharmacy(userEmail);
    const status = String(rawStatus || '').toUpperCase().replace(/\s+/g, '_');
    const allowed = ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(status)) throw new BadRequestException('Invalid order status.');
    const result: any = await this.db.query('UPDATE pharmacy_order SET status=?, updatedAt=NOW(3) WHERE id=? AND pharmacyId=?', [status, id, pharmacy.id]);
    if (!Number(result?.affectedRows || 0)) throw new NotFoundException('Order not found.');
    return { id, status };
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
}
