import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('prescription-requests')
  getPrescriptionRequests(@Request() request: any) {
    return this.pharmacyService.getPrescriptionRequests(request.user.email);
  }

  @Get('prescription-requests/:id')
  getPrescriptionRequest(@Request() request: any, @Param('id') id: string) {
    return this.pharmacyService.getPrescriptionRequest(request.user.email, id);
  }

  @Post('prescription-requests/:id/quotation')
  saveQuotation(@Request() request: any, @Param('id') id: string, @Body() data: any) {
    return this.pharmacyService.saveQuotation(request.user.email, id, data);
  }

  @Get('quotations')
  getQuotations(@Request() request: any) {
    return this.pharmacyService.getQuotations(request.user.email);
  }

  @Get('orders')
  getOrders(@Request() request: any) {
    return this.pharmacyService.getOrders(request.user.email);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Request() request: any, @Param('id') id: string, @Body('status') status: string) {
    return this.pharmacyService.updateOrderStatus(request.user.email, id, status);
  }

  @Get('inventory')
  getInventory(@Request() request: any) {
    return this.pharmacyService.getInventory(request.user.email);
  }

  @Post('inventory')
  addInventoryItem(@Request() request: any, @Body() data: any) {
    return this.pharmacyService.addInventoryItem(request.user.email, data);
  }

  @Get('profile')
  getProfile(@Request() request: any) {
    return this.pharmacyService.getProfile(request.user.email);
  }

  @Put('profile')
  updateProfile(@Request() request: any, @Body() data: any) {
    return this.pharmacyService.updateProfile(request.user.email, data);
  }

  @Get('notifications')
  getNotifications(@Request() request: any) {
    return this.pharmacyService.getNotifications(request.user.email);
  }

  @Put('notifications/:id/read')
  markNotificationRead(@Request() request: any, @Param('id') id: string) {
    return this.pharmacyService.markNotificationRead(request.user.email, id);
  }

  @Put('notifications/read-all')
  markAllNotificationsRead(@Request() request: any) {
    return this.pharmacyService.markAllNotificationsRead(request.user.email);
  }
}
