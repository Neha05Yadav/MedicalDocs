import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql.service';

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

  async getSalesPayments() {
    const rows = await this.db.query(`SELECT i.id, h.name AS hospital, i.totalAmount, i.date, i.status FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ORDER BY i.date DESC`);
    return { payments: rows.map(row => ({ id: row.id, hospital: row.hospital || 'Unknown facility', amount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toLocaleDateString('en-IN'), status: ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()) ? 'Successful' : row.status })) };
  }

  async getSalesRevenue() {
    const overview = await this.getSalesOverview();
    const [total, currentMonth, previousMonth, currentYear, previousYear] = await Promise.all([
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND YEAR(date) = YEAR(CURDATE())`),
      this.db.queryOne(`SELECT COALESCE(SUM(totalAmount), 0) AS value FROM invoice WHERE UPPER(status) IN ('PAID','SUCCESSFUL') AND YEAR(date) = YEAR(CURDATE()) - 1`),
    ]);
    const totalValue = Number(total?.value || 0);
    const monthlyValue = Number(currentMonth?.value || 0);
    const annualValue = Number(currentYear?.value || 0);
    const monthlyChange = this.change(monthlyValue, Number(previousMonth?.value || 0)).change;
    const annualChange = this.change(annualValue, Number(previousYear?.value || 0)).change;
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
      revenueData: overview.revenueData.map(row => ({ month: row.name, revenue: row.value, target: 0 })),
      sourceData: [{ name: 'Hospital billing', amount: this.money(totalValue), value: totalValue > 0 ? 100 : 0, color: '#4f46e5' }],
    };
  }

  async getAccountsInvoices(status?: string) {
    const params: any[] = [];
    let where = '';
    if (status) { where = 'WHERE UPPER(i.status) = ?'; params.push(status.toUpperCase() === 'SUCCESSFUL' ? 'PAID' : status.toUpperCase()); }
    const rows = await this.db.query(`SELECT i.*, h.name AS client FROM invoice i LEFT JOIN hospital h ON h.id = i.hospitalId ${where} ORDER BY i.date DESC`, params);
    return rows.map(row => ({ id: row.id, invoiceNo: row.id, hospitalId: row.hospitalId, client: row.client || 'Unknown facility', hospital: row.client || 'Unknown facility', type: 'Facility', amount: Number(row.totalAmount || 0), baseAmount: this.money(Number(row.totalAmount || 0)), tax: this.money(0), totalAmount: this.money(Number(row.totalAmount || 0)), date: new Date(row.date).toISOString(), status: ['PAID','SUCCESSFUL'].includes(String(row.status).toUpperCase()) ? 'Paid' : row.status, method: 'Not recorded', transactionId: row.id }));
  }

  async getAccountsOverview() {
    const rows = await this.getAccountsInvoices();
    const paid = rows.filter(row => row.status === 'Paid');
    const pending = rows.filter(row => String(row.status).toUpperCase() === 'PENDING');
    const sum = (items: any[]) => items.reduce((total, row) => total + Number(row.amount || 0), 0);
    const monthly = new Map<string, number>();
    paid.forEach(row => { const date = new Date(row.date); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; monthly.set(key, (monthly.get(key) || 0) + Number(row.amount)); });
    const revenueData = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (5 - index)); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; return { month: date.toLocaleDateString('en-US', { month: 'short' }), revenue: monthly.get(key) || 0 }; });
    return { kpi: { totalIncome: this.money(sum(rows)), totalCollected: this.money(sum(paid)), pendingReceivable: this.money(sum(pending)), overdueAmount: this.money(0), refundIssued: this.money(0) }, revenueData };
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
