import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ManagementService } from '../management.service';

@Controller('management/accounts')
export class AccountsController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview')
  async getOverview() {
    return {
      kpiData: [
        { title: "Total Receivables", value: "₹ 8,45,000", change: "+12.5%", isPositive: true },
        { title: "Pending Invoices", value: "45", change: "-5.4%", isPositive: true },
        { title: "Total Processed", value: "₹ 15,20,000", change: "+8.2%", isPositive: true },
        { title: "Refunds Issued", value: "₹ 25,000", change: "+2.1%", isPositive: false },
      ],
      recentInvoices: [
        { id: "INV-1001", hospital: "City Hospital", amount: "₹ 15,000", date: "20 Jun 2026", status: "Paid" },
        { id: "INV-1002", hospital: "Sunrise Clinic", amount: "₹ 8,500", date: "19 Jun 2026", status: "Pending" },
        { id: "INV-1003", hospital: "Life Care Lab", amount: "₹ 5,000", date: "18 Jun 2026", status: "Overdue" },
      ],
      recentRefunds: [
        { id: "REF-001", hospital: "Metro Health", amount: "₹ 2,000", date: "15 Jun 2026", reason: "Cancellation" },
      ]
    };
  }

  @Get('invoices')
  async getInvoices() {
    return [
      { id: "INV-1001", hospital: "City Hospital", amount: "₹ 15,000", date: "20 Jun 2026", status: "Paid" },
      { id: "INV-1002", hospital: "Sunrise Clinic", amount: "₹ 8,500", date: "19 Jun 2026", status: "Pending" },
      { id: "INV-1003", hospital: "Life Care Lab", amount: "₹ 5,000", date: "18 Jun 2026", status: "Overdue" },
    ];
  }

  @Get('refunds')
  async getRefunds() {
    return [
      { id: "REF-001", hospital: "Metro Health", amount: "₹ 2,000", date: "15 Jun 2026", reason: "Cancellation" },
    ];
  }

  @Get('payments')
  async getPayments() {
    return [];
  }

  @Get('reports')
  async getReports() {
    return [];
  }

  @Get('notifications')
  async getNotifications() {
    return [];
  }
}
