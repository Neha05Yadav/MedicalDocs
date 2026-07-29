import { Controller, Get, Post, Put, Delete, Param, Query, Body, Patch, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { ManagementAuthGuard } from '../management-auth.guard';
import { AdminService } from '../admin/admin.service';

@Controller('management/super-admin')
@UseGuards(ManagementAuthGuard)
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly adminService: AdminService,
  ) {}

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

  @Get('reports/patients')
  async getReportPatients() {
    return this.adminService.getReportPatients();
  }

  @Put('reports/:id/status')
  async updateReportStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateReportStatus(id, body.status);
  }

  @Delete('reports/:id')
  async deleteReport(@Param('id') id: string) {
    return this.adminService.deleteReport(id);
  }

  @Post('facilities')
  async createHospital(@Body() body: any) {
    return this.adminService.createHospital({ ...body, type: 'HOSPITAL' });
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
