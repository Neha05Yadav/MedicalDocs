import { Controller, Get } from '@nestjs/common';
import { ManagementService } from '../management.service';

@Controller('management/support')
export class SupportController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview')
  async getOverview() {
    return { message: 'Support overview pending implementation' };
  }
}
