import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ManagementService } from '../management.service';
import { ManagementAuthGuard } from '../management-auth.guard';

@Controller('management/sales')
@UseGuards(ManagementAuthGuard)
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

  @Patch('subscriptions/:id')
  updateSubscription(@Param('id') id: string, @Body() body: { action: string; status?: string; plan_name?: string }) {
    return this.managementService.updateSalesSubscription(id, body);
  }

  @Get('revenue')
  getRevenue() {
    return this.managementService.getSalesRevenue();
  }

  @Get('payments')
  getPayments() {
    return this.managementService.getSalesPayments();
  }

  @Patch('payments/:id')
  updatePayment(@Param('id') id: string, @Body('action') action: string) {
    return this.managementService.updateSalesPayment(id, action);
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
