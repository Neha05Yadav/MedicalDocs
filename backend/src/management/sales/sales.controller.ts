import { Controller, Get } from '@nestjs/common';
import { ManagementService } from '../management.service';

@Controller('management/sales')
export class SalesController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview')
  getOverview() {
    return this.managementService.getSalesOverview();
  }

  @Get('subscriptions')
  getSubscriptions() {
    return this.managementService.getSalesSubscriptions();
  }

  @Get('revenue')
  getRevenue() {
    return this.managementService.getSalesRevenue();
  }

  @Get('payments')
  getPayments() {
    return this.managementService.getSalesPayments();
  }

  @Get('reports')
  getReports() {
    return this.managementService.getSalesRevenue();
  }

  @Get('notifications')
  getNotifications() {
    return this.managementService.getSalesNotifications();
  }
}
