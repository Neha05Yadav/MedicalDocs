import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ManagementService {
  constructor(private db: MysqlService) {}

  private money(value: number) { return `₹ ${value.toLocaleString('en-IN')}`; }

  private change(current: number, previous: number) {
    if (previous === 0) return { change: current === 0 ? '0%' : 'New', isPositive: true };
    const percent = Math.round(((current - previous) / previous) * 10_000) / 100;
    return { change: `${percent >= 0 ? '+' : ''}${percent}%`, isPositive: percent >= 0 };
  }

  async getSalesOverview() {
    const [revenue, priorRevenue, active, expired, newRegistrations] = await Promise.all([
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COUNT(*) AS value FROM hospitalsubscription WHERE UPPER(status) = 'ACTIVE' AND (endDate IS NULL OR endDate >= NOW())`),
      this.db.queryOne(`SELECT COUNT(*) AS value FROM hospitalsubscription WHERE UPPER(status) != 'ACTIVE' OR endDate < NOW()`),
      this.db.queryOne(`SELECT COUNT(*) AS value FROM user WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
    ]);
    const currentRevenue = Number(revenue?.value || 0);
    const previousRevenue = Number(priorRevenue?.value || 0);
    const monthlyRows = await this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(date, '%Y-%m')`);
    const monthlyMap = new Map(monthlyRows.map(row => [row.monthKey, Number(row.value)]));
    const revenueData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return { name: date.toLocaleDateString('en-US', { month: 'short' }), value: monthlyMap.get(key) || 0 };
    });
    const recentInvoices = await this.db.query(`SELECT i.id, h.name AS customer, i.totalAmount, i.date, i.status FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ORDER BY i.date DESC LIMIT 5`);
    const recentSubscriptions = await this.db.query(`SELECT hs.createdAt, hs.status, h.name AS hospitalName, sp.name AS planName FROM hospitalsubscription hs INNER JOIN hospital h ON h.id = hs.hospitalId INNER JOIN subscriptionplan sp ON sp.id = hs.planId ORDER BY hs.createdAt DESC LIMIT 5`);
    return {
      kpiData: [
        { title: 'Revenue This Month', value: this.money(currentRevenue), ...this.change(currentRevenue, previousRevenue) },
        { title: 'Active Subscriptions', value: String(active?.value || 0), change: 'Live', isPositive: true },
        { title: 'Expired Subscriptions', value: String(expired?.value || 0), change: 'Live', isPositive: Number(expired?.value || 0) === 0 },
        { title: 'New Registrations', value: String(newRegistrations?.value || 0), change: 'This month', isPositive: true },
      ],
      revenueData,
      subscriptionData: [{ name: 'Hospital Plans', value: Number(active?.value || 0), color: '#3b82f6' }],
      recentPayments: recentInvoices.map(row => ({ id: row.id, customer: row.customer || 'Unknown facility', amount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toLocaleDateString('en-IN'), status: ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()) ? 'Paid' : row.status })),
      recentActivity: recentSubscriptions.map(row => ({ title: `${row.hospitalName} · ${row.planName} · ${row.status}`, time: new Date(row.createdAt).toLocaleString('en-IN'), type: 'hospital' })),
    };
  }

  async getSalesSubscriptions() {
    const rows = await this.db.query(`SELECT hs.id, h.name AS facility, sp.name AS plan, sp.price, hs.status, hs.startDate, hs.endDate FROM hospitalsubscription hs INNER JOIN hospital h ON h.id = hs.hospitalId INNER JOIN subscriptionplan sp ON sp.id = hs.planId ORDER BY hs.updatedAt DESC`);
    return { subscriptions: rows.map(row => ({ ...row, amount: this.money(Number(row.price || 0)), startDate: new Date(row.startDate).toLocaleDateString('en-IN'), endDate: row.endDate ? new Date(row.endDate).toLocaleDateString('en-IN') : 'No fixed expiry' })) };
  }

  async updateSalesSubscription(id: string, body: { action: string; status?: string; plan_name?: string }) {
    const subscription = await this.db.queryOne('SELECT id FROM hospitalsubscription WHERE id = ?', [id]);
    if (!subscription) throw new NotFoundException('Subscription was not found.');

    let message = '';
    if (body.action === 'update_status') {
      const allowed = ['Active', 'Expired', 'Suspended', 'Renewal Due'];
      if (!body.status || !allowed.includes(body.status)) throw new BadRequestException('Invalid subscription status.');
      await this.db.query('UPDATE hospitalsubscription SET status = ?, updatedAt = ? WHERE id = ?', [body.status, new Date(), id]);
      message = `Your subscription status was updated to ${body.status}.`;
    } else if (body.action === 'change_plan') {
      if (!body.plan_name) throw new BadRequestException('Plan name is required.');
      const plan = await this.db.queryOne('SELECT id FROM subscriptionplan WHERE name = ?', [body.plan_name]);
      if (!plan) throw new NotFoundException('Subscription plan was not found.');
      await this.db.query('UPDATE hospitalsubscription SET planId = ?, updatedAt = ? WHERE id = ?', [plan.id, new Date(), id]);
      message = `Your subscription plan was changed to ${body.plan_name}.`;
    } else {
      throw new BadRequestException('Unsupported subscription action.');
    }
    const owner = await this.db.queryOne('SELECT hospitalId FROM hospitalsubscription WHERE id = ?', [id]);
    if (owner?.hospitalId) {
      const now = new Date();
      await this.db.query(`INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, 'SUBSCRIPTION_UPDATED', 'Subscription updated', ?, 0, 0, 'Low', ?, ?)`, [uuidv4(), owner.hospitalId, message, now, now]);
    }
    return { success: true };
  }

  async getSalesPayments() {
    const rows = await this.db.query(`SELECT i.id, h.name AS hospital, i.totalAmount, i.date, i.status FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ORDER BY i.date DESC`);
    return { payments: rows.map(row => ({ id: row.id, hospital: row.hospital || 'Unknown facility', amount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toLocaleDateString('en-IN'), method: 'Invoice payment', status: ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()) ? 'Successful' : row.status })) };
  }

  async updateSalesPayment(id: string, action: string) {
    const invoice = await this.db.queryOne('SELECT id, hospitalId, status FROM invoice WHERE id = ?', [id]);
    if (!invoice) throw new NotFoundException('Payment invoice was not found.');
    const nextStatus = action === 'mark_paid' ? 'Paid' : action === 'refund' ? 'Refunded' : null;
    if (!nextStatus) throw new BadRequestException('Unsupported payment action.');
    if (action === 'refund' && !['PAID', 'SUCCESSFUL'].includes(String(invoice.status).toUpperCase())) {
      throw new BadRequestException('Only successful payments can be refunded.');
    }
    await this.db.query('UPDATE invoice SET status = ?, updatedAt = ? WHERE id = ?', [nextStatus, new Date(), id]);
    if (invoice.hospitalId) {
      const now = new Date();
      await this.db.query(`INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, 'PAYMENT_UPDATED', 'Payment updated', ?, 0, 0, 'Low', ?, ?)`, [uuidv4(), invoice.hospitalId, `Invoice ${id} is now ${nextStatus}.`, now, now]);
    }
    return { success: true, updatedStatus: nextStatus === 'Paid' ? 'Successful' : nextStatus };
  }

  async getSalesRevenue() {
    const [total, currentMonth, previousMonth, currentYear, previousYear, monthlyRows] = await Promise.all([
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND YEAR(date) = YEAR(CURDATE())`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND YEAR(date) = YEAR(CURDATE()) - 1`),
      this.db.query(`SELECT DATE_FORMAT(date, '%Y-%m') AS monthKey, COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= MAKEDATE(YEAR(CURDATE()) - 1, 1) GROUP BY DATE_FORMAT(date, '%Y-%m') ORDER BY monthKey`),
    ]);
    const totalValue = Number(total?.value || 0);
    const monthlyValue = Number(currentMonth?.value || 0);
    const annualValue = Number(currentYear?.value || 0);
    const monthlyChange = this.change(monthlyValue, Number(previousMonth?.value || 0)).change;
    const annualChange = this.change(annualValue, Number(previousYear?.value || 0)).change;
    const monthlyMap = new Map(monthlyRows.map(row => [String(row.monthKey), Number(row.value || 0)]));
    const toChartPoint = (date: Date) => {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthlyMap.get(monthKey) || 0,
        target: 0,
      };
    };
    const now = new Date();
    const thisYearData = Array.from({ length: 12 }, (_, month) => toChartPoint(new Date(now.getFullYear(), month, 1)));
    const lastYearData = Array.from({ length: 12 }, (_, month) => toChartPoint(new Date(now.getFullYear() - 1, month, 1)));
    const lastSixMonthsData = Array.from({ length: 6 }, (_, index) => toChartPoint(new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)));
    return {
      kpi: {
        totalRevenue: this.money(totalValue),
        totalRevenueChange: annualChange,
        monthlyRevenue: this.money(monthlyValue),
        monthlyRevenueChange: monthlyChange,
        annualRevenue: this.money(annualValue),
        annualRevenueChange: annualChange,
        renewalRevenue: this.money(0),
        renewalRevenueChange: '0%',
      },
      revenueData: thisYearData,
      revenueRanges: {
        thisYear: thisYearData,
        lastSixMonths: lastSixMonthsData,
        lastYear: lastYearData,
      },
      sourceData: [{ name: 'Hospital billing', amount: this.money(totalValue), value: totalValue > 0 ? 100 : 0, color: '#4f46e5' }],
    };
  }

  async getAccountsInvoices(status?: string) {
    const params: any[] = [];
    let where = '';
    if (status) { where = 'WHERE UPPER(i.status) = ?'; params.push(status.toUpperCase() === 'SUCCESSFUL' ? 'PAID' : status.toUpperCase()); }
    const rows = await this.db.query(`SELECT i.*, h.name AS client FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ${where} ORDER BY i.date DESC`, params);
    return rows.map(row => ({ id: row.id, invoiceNo: row.id, hospitalId: row.hospitalId, patientId: row.patientId, client: row.client || 'Unknown facility', hospital: row.client || 'Unknown facility', type: 'Facility', amount: Number(row.totalAmount || 0), baseAmount: this.money(Number(row.consultationFee || 0)), tax: this.money(Number(row.testFee || 0)), totalAmount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toISOString(), status: ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()) ? 'Paid' : String(row.status).toUpperCase() === 'PENDING' ? 'Unpaid' : row.status, method: 'Invoice', transactionId: row.id }));
  }

  async getInvoiceOptions() {
    const [hospitals, patients] = await Promise.all([
      this.db.query(`SELECT id, name, type FROM hospital ORDER BY name ASC`),
      this.db.query(`SELECT id, name, email FROM patient ORDER BY name ASC`),
    ]);
    return { hospitals, patients };
  }

  async createAccountInvoice(body: {
    invoiceNo?: string;
    hospitalId?: string;
    patientId?: string;
    baseAmount?: number | string;
    taxRate?: number | string;
    status?: string;
    date?: string;
  }) {
    if (!body.hospitalId || !body.patientId) throw new BadRequestException('Facility and patient are required.');
    const baseAmount = Number(body.baseAmount);
    const taxRate = Number(body.taxRate ?? 0);
    if (!Number.isFinite(baseAmount) || baseAmount < 0) throw new BadRequestException('Enter a valid base amount.');
    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) throw new BadRequestException('Enter a valid GST rate.');

    const [hospital, patient] = await Promise.all([
      this.db.queryOne(`SELECT id, name FROM hospital WHERE id = ?`, [body.hospitalId]),
      this.db.queryOne(`SELECT id, name FROM patient WHERE id = ?`, [body.patientId]),
    ]);
    if (!hospital) throw new NotFoundException('Selected facility was not found.');
    if (!patient) throw new NotFoundException('Selected patient was not found.');

    const suppliedId = String(body.invoiceNo || '').trim().toUpperCase();
    const invoiceId = suppliedId || `INV-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    if (!/^[A-Z0-9-]{5,40}$/.test(invoiceId)) throw new BadRequestException('Invoice number may contain only letters, numbers, and hyphens.');
    if (await this.db.queryOne(`SELECT id FROM invoice WHERE id = ?`, [invoiceId])) throw new BadRequestException('This invoice number already exists.');

    const allowedStatus: Record<string, string> = { UNPAID: 'Pending', PENDING: 'Pending', PARTIAL: 'Partial', PAID: 'Paid' };
    const status = allowedStatus[String(body.status || 'Unpaid').toUpperCase()];
    if (!status) throw new BadRequestException('Invalid invoice status.');
    const invoiceDate = body.date ? new Date(`${body.date}T00:00:00`) : new Date();
    if (Number.isNaN(invoiceDate.getTime())) throw new BadRequestException('Invalid invoice date.');
    const taxAmount = Math.round((baseAmount * taxRate / 100) * 100) / 100;
    const totalAmount = Math.round((baseAmount + taxAmount) * 100) / 100;
    const now = new Date();

    const connection = await this.db.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO invoice (id, patientId, hospitalId, consultationFee, testFee, totalAmount, status, date, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoiceId, body.patientId, body.hospitalId, baseAmount, taxAmount, totalAmount, status, invoiceDate, now],
      );
      await connection.execute(
        `INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (?, ?, 'INVOICE_CREATED', 'New invoice created', ?, 0, 1, 'Medium', ?, ?)`,
        [uuidv4(), body.hospitalId, `${invoiceId} was created for ${patient.name}. Total amount: ${this.money(totalAmount)}.`, now, now],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return { success: true, invoiceId };
  }

  async getAccountRefunds() {
    const rows = await this.db.query(`SELECT i.id, i.totalAmount, i.date, h.name AS client FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId WHERE UPPER(i.status) = 'REFUNDED' ORDER BY i.updatedAt DESC`);
    return {
      refunds: rows.map(row => ({ id: row.id, invoiceNo: row.id, client: row.client || 'Unknown facility', amount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toISOString(), status: 'Refunded' })),
    };
  }

  async getAccountsOverview() {
    const rows = await this.getAccountsInvoices();
    const paid = rows.filter(row => row.status === 'Paid');
    const pending = rows.filter(row => ['PENDING', 'UNPAID', 'PARTIAL'].includes(String(row.status).toUpperCase()));
    const refunded = rows.filter(row => String(row.status).toUpperCase() === 'REFUNDED');
    const sum = (items: any[]) => items.reduce((total, row) => total + Number(row.amount || 0), 0);
    const billedByMonth = new Map<string, number>();
    const collectedByMonth = new Map<string, number>();
    const addToMonth = (map: Map<string, number>, row: any) => {
      const date = new Date(row.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + Number(row.amount || 0));
    };
    rows.forEach(row => addToMonth(billedByMonth, row));
    paid.forEach(row => addToMonth(collectedByMonth, row));
    const point = (date: Date) => {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return { month: date.toLocaleDateString('en-US', { month: 'short' }), income: billedByMonth.get(key) || 0, collected: collectedByMonth.get(key) || 0 };
    };
    const now = new Date();
    const thisYear = Array.from({ length: 12 }, (_, month) => point(new Date(now.getFullYear(), month, 1)));
    const lastYear = Array.from({ length: 12 }, (_, month) => point(new Date(now.getFullYear() - 1, month, 1)));
    const lastSixMonths = Array.from({ length: 6 }, (_, index) => point(new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)));
    return {
      kpi: { totalIncome: this.money(sum(rows)), totalCollected: this.money(sum(paid)), pendingReceivable: this.money(sum(pending)), overdueAmount: this.money(0), refundIssued: this.money(sum(refunded)) },
      revenueData: lastSixMonths,
      revenueRanges: { thisYear, lastYear, lastSixMonths },
    };
  }

  async getAccountsBilling() {
    const rows = await this.getAccountsInvoices();
    const grouped = new Map<string, any[]>();
    rows.forEach(row => grouped.set(row.hospital, [...(grouped.get(row.hospital) || []), row]));
    return { ledger: Array.from(grouped.entries()).map(([client, invoices], index) => { const billed = invoices.reduce((sum, row) => sum + row.amount, 0); const paid = invoices.filter(row => row.status === 'Paid').reduce((sum, row) => sum + row.amount, 0); return { id: `LEDGER-${index + 1}`, client, type: 'Facility', totalBilled: this.money(billed), totalPaid: this.money(paid), outstanding: this.money(billed - paid), history: invoices.map(row => ({ desc: row.invoiceNo, date: new Date(row.date).toLocaleDateString('en-IN'), amount: this.money(row.amount), balance: this.money(row.status === 'Paid' ? 0 : row.amount) })) }; }) };
  }

  async sendPaymentReminder(invoiceId?: string) {
    const params: any[] = [];
    let filter = `UPPER(i.status) = 'PENDING'`;
    if (invoiceId) { filter += ' AND i.id = ?'; params.push(invoiceId); }
    const invoices = await this.db.query(`SELECT i.id, i.hospitalId, i.totalAmount, h.name FROM invoice i INNER JOIN hospital h ON h.id = i.hospitalId WHERE ${filter}`, params);
    for (const invoice of invoices) {
      await this.db.query(`INSERT INTO notification (id, hospitalId, type, title, message, isRead, actionRequired, severity, createdAt, updatedAt) VALUES (UUID(), ?, 'PAYMENT_REMINDER', 'Payment reminder', ?, 0, 1, 'Medium', ?, ?)`, [invoice.hospitalId, `Invoice ${invoice.id} has an outstanding balance of ${this.money(Number(invoice.totalAmount || 0))}.`, new Date(), new Date()]);
    }
    return { sent: invoices.length, message: invoices.length ? `Sent ${invoices.length} in-app payment reminder${invoices.length === 1 ? '' : 's'}.` : 'No pending invoice matched.' };
  }

  async getSalesNotifications() {
    const [subscriptions, invoices] = await Promise.all([
      this.db.query(`SELECT hs.id, hs.status, hs.endDate, h.name AS facility, sp.name AS plan FROM hospitalsubscription hs INNER JOIN hospital h ON h.id = hs.hospitalId INNER JOIN subscriptionplan sp ON sp.id = hs.planId WHERE hs.endDate IS NOT NULL AND hs.endDate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY hs.endDate ASC LIMIT 20`),
      this.db.query(`SELECT i.id, i.status, i.totalAmount, i.date, h.name AS facility FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId WHERE UPPER(i.status) = 'PENDING' ORDER BY i.date DESC LIMIT 20`),
    ]);
    const expiry = subscriptions.map(row => ({ id: `subscription-${row.id}`, type: new Date(row.endDate) < new Date() ? 'expired' : 'expiry', title: `${row.plan} subscription ${new Date(row.endDate) < new Date() ? 'expired' : 'expires soon'}`, facility: row.facility, desc: `End date: ${new Date(row.endDate).toLocaleDateString('en-IN')}`, time: new Date(row.endDate).toLocaleDateString('en-IN') }));
    const payment = invoices.map(row => ({ id: `invoice-${row.id}`, type: 'payment', title: 'Payment pending', facility: row.facility || 'Unknown facility', desc: `Invoice ${row.id} · ${this.money(Number(row.totalAmount || 0))}`, time: new Date(row.date).toLocaleDateString('en-IN') }));
    return { notifications: [...expiry, ...payment] };
  }

  async getAccountsNotifications() {
    const rows = await this.db.query(`SELECT i.id, i.status, i.totalAmount, i.date, h.name AS facility FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ORDER BY i.date DESC LIMIT 30`);
    return { notifications: rows.map(row => { const paid = ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()); return { id: row.id, tab: paid ? 'Invoices' : 'Payment Alerts', type: paid ? 'invoice' : 'payment', title: paid ? 'Invoice paid' : 'Payment requires attention', facility: row.facility || 'Unknown facility', desc: `Invoice ${row.id} · ${this.money(Number(row.totalAmount || 0))} · ${row.status}`, time: new Date(row.date).toLocaleDateString('en-IN') }; }) };
  }

  async getStatus() {
    return {
      status: 'online',
      module: 'Management'
    };
  }
}
