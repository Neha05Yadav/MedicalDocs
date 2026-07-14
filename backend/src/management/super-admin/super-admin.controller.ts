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

  @Get('audit-logs')
  async getAuditLogs() {
    return [
      { id: "1", action_type: "Login", user_email: "admin@medidoc.com", details: "Successful login", created_at: new Date() },
      { id: "2", action_type: "Update", user_email: "admin@medidoc.com", details: "Updated settings", created_at: new Date() }
    ];
  }

  @Get('settings')
  async getSettings() {
    return {
      website_name: "Medidoc",
      maintenance_mode: false,
      require_2fa: true
    };
  }

  @Get('notifications')
  async getNotifications() {
    return [];
  }

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
    return {
      logs: [
        { id: 1, action: "Logged in", date: new Date().toISOString() },
        { id: 2, action: "Updated facility status", date: new Date(Date.now() - 86400000).toISOString() }
      ]
    };
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
