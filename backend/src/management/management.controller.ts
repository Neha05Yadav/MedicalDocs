import { Controller, Get, UseGuards } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementAuthGuard } from './management-auth.guard';

@Controller('management')
@UseGuards(ManagementAuthGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('status')
  async getStatus() {
    return this.managementService.getStatus();
  }
}
