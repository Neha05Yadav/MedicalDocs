import { Injectable, NotFoundException } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupportTicketService {
  constructor(private db: MysqlService) {}

  private async resolveTicket(identifier: string) {
    const ticket = await this.db.queryOne(
      'SELECT * FROM support_ticket WHERE id = ? OR ticketId = ? LIMIT 1',
      [identifier, identifier],
    );
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  private async getUserDetails(userEmail: string) {
    // Try to find the user in different tables based on email to determine role
    let user = await this.db.queryOne('SELECT id, name FROM patient WHERE email = ?', [userEmail]);
    if (user) return { id: user.id, name: user.name, role: 'Patient' };

    user = await this.db.queryOne('SELECT id, name FROM doctor WHERE email = ?', [userEmail]);
    if (user) return { id: user.id, name: user.name, role: 'Clinic' };

    user = await this.db.queryOne('SELECT id, name FROM hospital WHERE email = ?', [userEmail]);
    if (user) return { id: user.id, name: user.name, role: 'Hospital' }; // Lab or Hospital

    // If not found in main tables, check if there's a generic user table or return a fallback
    return { id: 'unknown', name: 'Unknown User', role: 'Unknown' };
  }

  private async generateTicketId() {
    // SUP-YYYY-MMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of tickets created today to generate the XXXX part
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const count = await this.db.queryOne('SELECT COUNT(*) as c FROM support_ticket WHERE createdAt >= ?', [todayStart]);
    
    const seq = String((count?.c || 0) + 1).padStart(4, '0');
    return `SUP-${year}-${month}${day}-${seq}`;
  }

  async createTicket(userEmail: string, data: { category: string, subject: string, description: string, priority: string, attachment?: string }) {
    const user = await this.getUserDetails(userEmail);
    const ticketId = await this.generateTicketId();
    const id = uuidv4();
    const now = new Date();

    await this.db.query(
      `INSERT INTO support_ticket (id, ticketId, userId, userName, userRole, category, subject, description, attachment, priority, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ticketId, user.id, user.name, user.role, data.category, data.subject, data.description, data.attachment || null, data.priority, 'Open', now, now]
    );

    // Generate a notification for the support team
    const notificationId = uuidv4();
    await this.db.query(
      `INSERT INTO notification (id, type, title, message, isRead, actionRequired, createdAt, updatedAt, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, 'support_ticket', 'New Support Ticket', `A new ${data.priority.toLowerCase()} priority ticket (${ticketId}) was raised by ${user.name} (${user.role}) regarding ${data.category}.`, 0, 1, now, now, data.priority.toLowerCase() === 'high' ? 'High' : 'Normal']
    );

    return { success: true, ticketId, id };
  }

  async getMyTickets(userEmail: string) {
    const user = await this.getUserDetails(userEmail);
    return this.db.query('SELECT * FROM support_ticket WHERE userId = ? ORDER BY createdAt DESC', [user.id]);
  }

  async getAllTickets() {
    return this.db.query(`
      SELECT st.*, std.assignedTo, std.internalNotes, std.updatedAt AS escalatedAt
      FROM support_ticket st
      LEFT JOIN support_ticket_details std ON std.ticketId = st.id
      ORDER BY st.updatedAt DESC
    `);
  }

  async getTicketDetails(id: string) {
    const ticket = await this.resolveTicket(id);
    const ticketRecordId = ticket.id;

    const details = await this.db.queryOne('SELECT * FROM support_ticket_details WHERE ticketId = ?', [ticketRecordId]);
    const replies = await this.db.query('SELECT * FROM support_ticket_reply WHERE ticketId = ? ORDER BY createdAt ASC', [ticketRecordId]);
    
    return { 
      ticket, 
      replies,
      details: details || { assignedTo: '', internalNotes: '' }
    };
  }

  async updateTicketStatus(id: string, status: string) {
    const resolvedTicket = await this.resolveTicket(id);
    const ticketRecordId = resolvedTicket.id;
    await this.db.query('UPDATE support_ticket SET status = ?, updatedAt = ? WHERE id = ?', [status, new Date(), ticketRecordId]);
    
    // Notify the user about status change
    const ticket = await this.db.queryOne('SELECT * FROM support_ticket WHERE id = ?', [ticketRecordId]);
    if (ticket) {
      const isPatient = ticket.userRole === 'Patient';
      await this.db.query(
        `INSERT INTO notification (id, type, title, message, isRead, actionRequired, createdAt, updatedAt, severity, userId, hospitalId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), 'support_ticket', 'Ticket Status Updated', `Your ticket ${ticket.ticketId} is now ${status}.`, 0, 0, new Date(), new Date(), 'Normal', isPatient ? ticket.userId : null, !isPatient ? ticket.userId : null]
      );
    }
    
    return { success: true };
  }

  async updateTicketDetails(id: string, assignedTo: string, internalNotes: string) {
    const ticket = await this.resolveTicket(id);
    const ticketRecordId = ticket.id;
    const existing = await this.db.queryOne('SELECT ticketId FROM support_ticket_details WHERE ticketId = ?', [ticketRecordId]);
    if (existing) {
      await this.db.query('UPDATE support_ticket_details SET assignedTo = ?, internalNotes = ?, updatedAt = ? WHERE ticketId = ?', [assignedTo, internalNotes, new Date(), ticketRecordId]);
    } else {
      await this.db.query('INSERT INTO support_ticket_details (ticketId, assignedTo, internalNotes, updatedAt) VALUES (?, ?, ?, ?)', [ticketRecordId, assignedTo, internalNotes, new Date()]);
    }
    return { success: true };
  }

  async addReply(id: string, userEmail: string, message: string) {
    const user = await this.getUserDetails(userEmail);
    const replyId = uuidv4();
    const now = new Date();

    let senderRole = user.role;
    let senderName = user.name;
    if (userEmail.includes('admin') || userEmail.includes('support')) {
      senderRole = 'Support Team';
      senderName = 'Support Agent';
    }

    await this.db.query(
      `INSERT INTO support_ticket_reply (id, ticketId, senderId, senderName, senderRole, message, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [replyId, id, user.id, senderName, senderRole, message, now]
    );

    await this.db.query('UPDATE support_ticket SET updatedAt = ? WHERE id = ?', [now, id]);
    const ticket = await this.db.queryOne('SELECT * FROM support_ticket WHERE id = ?', [id]);

    // If a user replies, create a notification for support team
    if (senderRole !== 'Support Team') {
      const notificationId = uuidv4();
      await this.db.query(
        `INSERT INTO notification (id, type, title, message, isRead, actionRequired, createdAt, updatedAt, severity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [notificationId, 'support_ticket_reply', 'New Support Reply', `User ${senderName} (${senderRole}) replied to ticket ${ticket?.ticketId}.`, 0, 0, now, now, 'Normal']
      );
    } else {
      // If Support Team replies, notify the user
      if (ticket) {
        const isPatient = ticket.userRole === 'Patient';
        await this.db.query(
          `INSERT INTO notification (id, type, title, message, isRead, actionRequired, createdAt, updatedAt, severity, userId, hospitalId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), 'support_ticket_reply', 'New Reply from Support', `Support Team replied to your ticket ${ticket.ticketId}.`, 0, 0, now, now, 'Normal', isPatient ? ticket.userId : null, !isPatient ? ticket.userId : null]
        );
      }
    }

    return { success: true, replyId };
  }

  async getSupportNotifications() {
    return this.db.query('SELECT * FROM notification WHERE type LIKE "support_ticket%" ORDER BY createdAt DESC');
  }

  async markSupportNotificationsRead() {
    await this.db.query('UPDATE notification SET isRead = 1 WHERE type LIKE "support_ticket%"');
    return { success: true };
  }
}
