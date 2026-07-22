import { Controller, Get, Post, Put, Delete, Param, Query, Body, Patch } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('management/super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('overview')
  async getOverview() {
    return this.superAdminService.getOverview();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.superAdminService.getAnalytics();
  }

  @Get('facilities')
  async getFacilities() {
    return this.superAdminService.getFacilities();
  }

  @Patch('facilities')
  async updateFacility(@Body() body: { id: string, status?: string, isVerified?: boolean }) {
    return this.superAdminService.updateFacility(body.id, { status: body.status, isVerified: body.isVerified });
  }

  @Get('audit')
  async getAuditLogs() {
    return this.superAdminService.getAuditLogs();
  }

  @Get('settings')
  async getSettings() {
    return this.superAdminService.getPlatformSettings();
  }

  @Patch('settings')
  async saveSettings(@Body() body: Record<string, any>) { return this.superAdminService.savePlatformSettings(body); }

  @Get('notifications')
  async getNotifications() {
    return this.superAdminService.getPlatformNotifications();
  }

  @Patch('notifications')
  async updateNotifications(@Body() body: { id?: string, action: string }) { return this.superAdminService.updatePlatformNotifications(body.id, body.action === 'mark_all_read'); }

  @Get('team')
  async getAdmins() {
    return this.superAdminService.getAdmins();
  }

  @Post('team')
  async createAdmin(@Body() body: any) {
    return this.superAdminService.createAdmin(body);
  }

  @Patch('team')
  async updateAdminStatus(@Body() body: { id: string, status: string }) {
    return this.superAdminService.updateAdminStatus(body.id, body.status);
  }

  @Delete('team')
  async deleteAdmin(@Query('id') id: string) {
    return this.superAdminService.deleteAdmin(id);
  }

  @Get('team/logs')
  async getAdminLogs(@Query('id') id: string) {
    return { logs: await this.superAdminService.getAdminLogs(id) };
  }

  @Get('users')
  async getAllUsers() {
    return this.superAdminService.getAllUsers();
  }

  @Patch('users')
  async updateUserStatus(@Body() body: { id: string, status: string, isVerified?: boolean }) {
    return this.superAdminService.updateUserStatus(body.id, body.status, body.isVerified);
  }

  @Delete('users')
  async deleteUser(@Query('id') id: string) {
    return this.superAdminService.deleteUser(id);
  }
}
