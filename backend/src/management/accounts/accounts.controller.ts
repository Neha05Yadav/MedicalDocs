import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ManagementService } from '../management.service';

@Controller('management/accounts')
export class AccountsController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview') getOverview() { return this.managementService.getAccountsOverview(); }
  @Get('invoices') async getInvoices() { return { invoices: await this.managementService.getAccountsInvoices() }; }
  @Get('payments') async getPayments(@Query('status') status?: string) { const payments = await this.managementService.getAccountsInvoices(status); return { payments: payments.map(payment => ({ ...payment, status: payment.status === 'Paid' ? 'Successful' : payment.status })) }; }
  @Get('billing') getBilling() { return this.managementService.getAccountsBilling(); }
  @Get('refunds') getRefunds() { return { refunds: [] }; }
  @Get('reports') getReports() { return this.managementService.getAccountsOverview(); }
  @Get('notifications') getNotifications() { return this.managementService.getAccountsNotifications(); }
  @Post('payment-reminders') sendReminder(@Body('invoiceId') invoiceId?: string) { return this.managementService.sendPaymentReminder(invoiceId); }
}
