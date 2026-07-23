/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('workspace')
  workspace(@Request() req: any) {
    return this.billing.workspace(req.user);
  }

  @Post('catalog')
  saveCatalogItem(@Request() req: any, @Body() body: any) {
    return this.billing.saveCatalogItem(req.user, body);
  }

  @Post('invoices')
  createInvoice(@Request() req: any, @Body() body: any) {
    return this.billing.createInvoice(req.user, body);
  }

  @Patch('invoices/:id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.billing.updateStatus(req.user, id, status);
  }
}
