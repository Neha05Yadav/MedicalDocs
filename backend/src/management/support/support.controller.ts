import { Controller, Get, UseGuards } from '@nestjs/common';
import { ManagementService } from '../management.service';
import { ManagementAuthGuard } from '../management-auth.guard';

@Controller('management/support')
@UseGuards(ManagementAuthGuard)
export class SupportController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview')
  async getOverview() {
    return this.managementService.getSupportOverview();
  }
}
