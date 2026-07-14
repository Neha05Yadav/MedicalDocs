import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('management/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  // ---- Settings Routes ----

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() body: any) {
    return this.adminService.updateSettings(body);
  }

  // ---- Users Management Routes ----

  @Get('users')
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('hospitals')
  async getHospitals() {
    return this.adminService.getAllHospitals();
  }

  @Post('hospitals')
  async createHospital(@Body() body: any) {
    return this.adminService.createHospital(body);
  }

  @Put('hospitals/:id/verify')
  async verifyHospital(@Param('id') id: string) {
    return this.adminService.verifyHospital(id);
  }

  @Put('hospitals/:id/status')
  async updateHospitalStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateHospitalStatus(id, body.status);
  }

  @Put('hospitals/:id')
  async updateHospital(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateHospital(id, body);
  }

  @Get('labs')
  async getLabs() {
    return this.adminService.getAllLabs();
  }

  @Post('labs')
  async createLab(@Body() body: any) {
    return this.adminService.createHospital({ ...body, type: 'LAB' });
  }

  @Put('labs/:id/verify')
  async verifyLab(@Param('id') id: string) {
    return this.adminService.verifyHospital(id);
  }

  @Put('labs/:id/status')
  async updateLabStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateHospitalStatus(id, body.status);
  }

  @Put('labs/:id')
  async updateLab(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateHospital(id, body);
  }

  @Get('labs/:id/staff')
  async getLabStaff(@Param('id') id: string) {
    return this.adminService.getLabStaff(id);
  }

  @Put('users/:userId/status')
  async updateStaffStatus(@Param('userId') userId: string, @Body() body: { status: string }) {
    return this.adminService.updateStaffStatus(userId, body.status);
  }

  @Get('labs/:id/services')
  async getLabServices(@Param('id') id: string) {
    return this.adminService.getLabServices(id);
  }

  @Put('labs/services/:serviceId/status')
  async updateLabServiceStatus(@Param('serviceId') serviceId: string, @Body() body: { status: string }) {
    return this.adminService.updateLabServiceStatus(serviceId, body.status);
  }

  @Get('reports')
  async getReports() {
    return this.adminService.getAllReports();
  }

  @Put('reports/:id/status')
  async updateReportStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateReportStatus(id, body.status);
  }

  @Delete('reports/:id')
  async deleteReport(@Param('id') id: string) {
    return this.adminService.deleteReport(id);
  }

  // ---- Admin Notifications Routes ----

  @Get('notifications')
  async getNotifications() {
    return this.adminService.getAdminNotifications();
  }

  @Post('notifications')
  async createNotification(@Body() body: { title: string, message: string, type: string, severity: string }) {
    return this.adminService.createAdminNotification(body);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead() {
    return this.adminService.markAllAdminNotificationsAsRead();
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.adminService.markNotificationAsRead(id);
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string) {
    return this.adminService.deleteNotification(id);
  }

  // ---- Access Management Routes ----

  @Get('access/roles')
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Post('access/roles')
  async createOrUpdateRole(@Body() body: any) {
    return this.adminService.createOrUpdateRole(body);
  }

  @Get('access/users')
  async getAccessUsers() {
    return this.adminService.getAccessUsers();
  }

  @Post('access/users')
  async provisionUser(@Body() body: any) {
    return this.adminService.provisionUser(body);
  }

  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Put('users/:id/password')
  async resetUserPassword(@Param('id') id: string) {
    return this.adminService.resetUserPassword(id);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ---- Subscriptions Routes ----
  @Get('subscriptions')
  async getSubscriptionPlans() {
    return this.adminService.getSubscriptionPlans();
  }

  @Post('subscriptions')
  async createSubscriptionPlan(@Body() body: any) {
    return this.adminService.createSubscriptionPlan(body);
  }

  @Delete('subscriptions')
  async deleteSubscriptionPlan(@Query('id') id: string) {
    return this.adminService.deleteSubscriptionPlan(id);
  }
}
