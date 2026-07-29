/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MysqlService } from '../mysql.service';

type LineInput = {
  catalogItemId?: string;
  name?: string;
  category?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  taxRate?: number;
};

@Injectable()
export class BillingService {
  constructor(private readonly db: MysqlService) {}


  private facilityType(role: string) {
    const value = String(role || '').toUpperCase();
    if (value.includes('LAB')) return 'LABORATORY';
    if (value.includes('CLINIC') || value.includes('DOCTOR')) return 'CLINIC';
    if (value.includes('HOSPITAL')) return 'HOSPITAL';
    return '';
  }

  private async identity(user: any) {
    const type = this.facilityType(user.role);
    if (!type)
      throw new ForbiddenException(
        'Only hospitals, clinics and laboratories can manage billing.',
      );
    const account = await this.db.queryOne<any>(
      'SELECT id, hospitalId, name, email FROM user WHERE email = ?',
      [user.email],
    );
    const facility = account?.hospitalId
      ? await this.db.queryOne<any>(
          'SELECT id, name, type FROM hospital WHERE id = ?',
          [account.hospitalId],
        )
      : await this.db.queryOne<any>(
          'SELECT id, name, type FROM hospital WHERE email = ?',
          [user.email],
        );
    return {
      id: facility?.id || account?.hospitalId || account?.id,
      name:
        facility?.name ||
        account?.name ||
        `${type[0]}${type.slice(1).toLowerCase()}`,
      type,
    };
  }

  private async patientForUser(user: any) {
    return this.db.queryOne<any>(
      'SELECT p.id, p.name, p.email, p.phone FROM patient p WHERE p.email = ? OR p.id = ?',
      [user.email, user.sub || ''],
    );
  }

  private async invoiceRows(where: string, params: any[]) {
    const invoices = await this.db.query<any>(
      `SELECT bi.*, p.name patientName, p.phone patientPhone
      FROM billing_invoice bi LEFT JOIN patient p ON p.id = bi.patientId ${where} ORDER BY bi.createdAt DESC`,
      params,
    );
    if (!invoices.length) return [];
    const items = await this.db.query<any>(
      `SELECT * FROM billing_invoice_item WHERE invoiceId IN (${invoices.map(() => '?').join(',')}) ORDER BY name`,
      invoices.map((i) => i.id),
    );
    return invoices.map((invoice) => ({
      ...invoice,
      subtotal: Number(invoice.subtotal),
      discountTotal: Number(invoice.discountTotal),
      taxTotal: Number(invoice.taxTotal),
      totalAmount: Number(invoice.totalAmount),
      amountPaid: Number(invoice.amountPaid),
      insuranceDeduction: Number(invoice.insuranceDeduction || 0),
      depositAdjusted: Number(invoice.depositAdjusted || 0),
      patientPayable: Number(invoice.patientPayable ?? invoice.totalAmount),
      items: items
        .filter((item) => item.invoiceId === invoice.id)
        .map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          taxRate: Number(item.taxRate),
          taxAmount: Number(item.taxAmount),
          lineTotal: Number(item.lineTotal),
        })),
    }));
  }

  async workspace(user: any) {
    const role = String(user.role || '').toUpperCase();
    if (role.includes('PATIENT')) {
      const patient = await this.patientForUser(user);
      return {
        viewer: 'PATIENT',
        patient,
        catalog: [],
        patients: [],
        invoices: patient
          ? await this.invoiceRows('WHERE bi.patientId = ?', [patient.id])
          : [],
      };
    }
    const facility = await this.identity(user);
    let patients = await this.db.query<any>(
      `SELECT DISTINCT p.id, p.name, p.phone, p.email
      FROM patient p
      LEFT JOIN accessrequest ar ON ar.patientId = p.id
      LEFT JOIN testrequest tr ON tr.patientId = p.id
      WHERE ar.hospitalId = ? OR tr.hospitalId = ? OR tr.referringHospitalId = ?
      ORDER BY p.name`,
      [facility.id, facility.id, facility.id],
    );
    if (!patients.length)
      patients = await this.db.query<any>(
        'SELECT id, name, phone, email FROM patient ORDER BY name LIMIT 200',
      );
    const catalog = await this.db.query<any>(
      'SELECT * FROM billing_catalog WHERE facilityId = ? AND active = 1 ORDER BY category, name',
      [facility.id],
    );
    return {
      viewer: facility.type,
      facility,
      patients,
      catalog: catalog.map((item) => ({
        ...item,
        price: Number(item.price),
        taxRate: Number(item.taxRate),
      })),
      invoices: await this.invoiceRows('WHERE bi.facilityId = ?', [
        facility.id,
      ]),
    };
  }

  async saveCatalogItem(user: any, body: any) {
    const facility = await this.identity(user);
    const name = String(body.name || '').trim();
    const category = String(body.category || '').trim();
    const price = Number(body.price);
    const taxRate = Number(body.taxRate || 0);
    if (!name || !category || !Number.isFinite(price) || price < 0)
      throw new BadRequestException(
        'Valid service name, category and price are required.',
      );
    if (taxRate < 0 || taxRate > 100)
      throw new BadRequestException('Tax rate must be between 0 and 100.');
    const id = uuidv4();
    const now = new Date();
    await this.db.query(
      `INSERT INTO billing_catalog
      (id, facilityId, facilityType, code, name, category, price, taxRate, active, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        id,
        facility.id,
        facility.type,
        String(body.code || '').trim() || null,
        name,
        category,
        price,
        taxRate,
        now,
        now,
      ],
    );
    return { id };
  }

  async createInvoice(user: any, body: any) {
    const facility = await this.identity(user);
    const patient = await this.db.queryOne<any>(
      'SELECT id, name, email FROM patient WHERE id = ?',
      [body.patientId],
    );
    if (!patient) throw new BadRequestException('Select a valid patient.');
    const inputs: LineInput[] = Array.isArray(body.items) ? body.items : [];
    if (!inputs.length)
      throw new BadRequestException('Add at least one bill item.');
    const lines = inputs.map((input) => {
      const name = String(input.name || '').trim();
      const category = String(input.category || 'Other').trim();
      const quantity = Number(input.quantity || 1);
      const unitPrice = Number(input.unitPrice);
      const discount = Number(input.discount || 0);
      const taxRate = Number(input.taxRate || 0);
      if (
        !name ||
        quantity <= 0 ||
        unitPrice < 0 ||
        discount < 0 ||
        taxRate < 0
      )
        throw new BadRequestException('One or more bill items are invalid.');
      const base = quantity * unitPrice;
      if (discount > base)
        throw new BadRequestException(
          `Discount for ${name} cannot exceed its amount.`,
        );
      const taxAmount = Number(
        (((base - discount) * taxRate) / 100).toFixed(2),
      );
      return {
        ...input,
        name,
        category,
        quantity,
        unitPrice,
        discount,
        taxRate,
        taxAmount,
        lineTotal: Number((base - discount + taxAmount).toFixed(2)),
      };
    });
    const subtotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );
    const discountTotal = lines.reduce((sum, line) => sum + line.discount, 0);
    const taxTotal = lines.reduce((sum, line) => sum + line.taxAmount, 0);
    const totalAmount = Number(
      (subtotal - discountTotal + taxTotal).toFixed(2),
    );
    const amountPaid = Math.min(
      Math.max(Number(body.amountPaid || 0), 0),
      totalAmount,
    );
    const status =
      amountPaid >= totalAmount && totalAmount > 0
        ? 'PAID'
        : amountPaid > 0
          ? 'PARTIALLY_PAID'
          : 'PENDING';
    const id = uuidv4();
    const invoiceNo = `${facility.type.slice(0, 3)}-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
    const now = new Date();
    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO billing_invoice
        (id, invoiceNo, patientId, facilityId, facilityType, facilityName, encounterType,
         status, subtotal, discountTotal, taxTotal, totalAmount, amountPaid, patientPayable,
         dueDate, notes, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          invoiceNo,
          patient.id,
          facility.id,
          facility.type,
          facility.name,
          body.encounterType || 'OPD',
          status,
          subtotal,
          discountTotal,
          taxTotal,
          totalAmount,
          amountPaid,
          totalAmount,
          body.dueDate || null,
          String(body.notes || '').trim() || null,
          now,
          now,
        ],
      );
      for (const line of lines) {
        await connection.execute(
          `INSERT INTO billing_invoice_item
          (id, invoiceId, catalogItemId, name, category, quantity, unitPrice, discount, taxRate, taxAmount, lineTotal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            id,
            line.catalogItemId || null,
            line.name,
            line.category,
            line.quantity,
            line.unitPrice,
            line.discount,
            line.taxRate,
            line.taxAmount,
            line.lineTotal,
          ],
        );
      }
      const patientUser = patient.email
        ? await connection.execute<any[]>(
            'SELECT id FROM user WHERE email = ?',
            [patient.email],
          )
        : null;
      const patientUserId = Array.isArray(patientUser?.[0])
        ? patientUser[0][0]?.id
        : null;
      if (patientUserId)
        await connection.execute(
          `INSERT INTO notification
        (id, userId, type, title, message, isRead, actionRequired, createdAt, updatedAt)
        VALUES (?, ?, 'INVOICE', 'New itemized bill', ?, 0, 1, ?, ?)`,
          [
            uuidv4(),
            patientUserId,
            `${facility.name} generated ${invoiceNo} for ₹${totalAmount.toFixed(2)}.`,
            now,
            now,
          ],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return { id, invoiceNo, status, totalAmount };
  }

  async updateStatus(user: any, id: string, requested: string) {
    const facility = await this.identity(user);
    const status = String(requested || '').toUpperCase();
    if (!['PENDING', 'PAID', 'CANCELLED'].includes(status))
      throw new BadRequestException('Invalid payment status.');
    const invoice = await this.db.queryOne<any>(
      'SELECT id, totalAmount FROM billing_invoice WHERE id = ? AND facilityId = ?',
      [id, facility.id],
    );
    if (!invoice)
      throw new ForbiddenException('Invoice does not belong to this facility.');
    await this.db.query(
      'UPDATE billing_invoice SET status = ?, amountPaid = ?, updatedAt = ? WHERE id = ?',
      [
        status,
        status === 'PAID' ? Number(invoice.totalAmount) : 0,
        new Date(),
        id,
      ],
    );
    return { success: true };
  }
}
