import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ManagementService } from '../management.service';
import { ManagementAuthGuard } from '../management-auth.guard';

@Controller('management/accounts')
@UseGuards(ManagementAuthGuard)
export class AccountsController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview') getOverview() { return this.managementService.getAccountsOverview(); }
  @Get('invoices') async getInvoices() { return { invoices: await this.managementService.getAccountsInvoices() }; }
  @Get('invoice-options') getInvoiceOptions() { return this.managementService.getInvoiceOptions(); }
  @Post('invoices') createInvoice(@Body() body: any) { return this.managementService.createAccountInvoice(body); }
  @Get('payments') async getPayments(@Query('status') status?: string) { const payments = await this.managementService.getAccountsInvoices(status); return { payments: payments.map(payment => ({ ...payment, status: payment.status === 'Paid' ? 'Successful' : payment.status })) }; }
  @Get('billing') getBilling() { return this.managementService.getAccountsBilling(); }
  @Get('refunds') getRefunds() { return this.managementService.getAccountRefunds(); }
  @Get('reports') getReports() { return this.managementService.getAccountsOverview(); }
  @Get('notifications') getNotifications(@Req() request: any) {
    return this.managementService.getAccountsNotifications(request.user.userId);
  }
  @Patch('notifications') markNotificationsRead(@Req() request: any, @Body() body: { id?: string; action?: string }) {
    return this.managementService.markAccountsNotificationsRead(request.user.userId, body);
  }
  @Post('payment-reminders') sendReminder(@Body('invoiceId') invoiceId?: string) { return this.managementService.sendPaymentReminder(invoiceId); }
}
