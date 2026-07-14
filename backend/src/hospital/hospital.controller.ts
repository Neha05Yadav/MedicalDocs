import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('overview')
  async getOverview() {
    return this.hospitalService.getOverview('');
  }

  @Post('add-treatment-patient')
  async addTreatmentPatient(@Body() data: any) {
    return this.hospitalService.addTreatmentPatient('', data);
  }

  @Put('update-treatment-patient')
  async updateTreatmentPatient(@Body() data: any) {
    return this.hospitalService.updateTreatmentPatient('', data);
  }

  @Get('labs')
  async getLabs() {
    return this.hospitalService.getAllLabs();
  }

  @Get('doctors')
  async getDoctors() {
    return this.hospitalService.getDoctors('');
  }

  @Post('doctors')
  async addDoctor(@Body() data: any) {
    return this.hospitalService.addDoctor('', data);
  }

  @Put('doctors/:id')
  async updateDoctor(@Param('id') id: string, @Body() data: any) {
    return this.hospitalService.updateDoctor('', id, data);
  }

  @Delete('doctors/:id')
  async deleteDoctor(@Param('id') id: string) {
    return this.hospitalService.deleteDoctor('', id);
  }

  @Get('search-patients')
  async searchPatients(@Query('q') q: string) {
    return this.hospitalService.searchPatients('', q);
  }

  @UseGuards(JwtAuthGuard)
  @Post('access-request')
  async createAccessRequest(@Body() data: { patientId: string; doctorId: string; reportTypes: string; reason: string; priority: string; duration: string }, @Request() req: any) {
    return this.hospitalService.createAccessRequest(req.user.email, data.patientId, data.doctorId, data.reportTypes, data.reason, data.priority, data.duration);
  }

  @UseGuards(JwtAuthGuard)
  @Get('patients/:id/records')
  async getPatientRecords(@Param('id') patientId: string, @Request() req: any) {
    return this.hospitalService.getPatientRecords(req.user.email, patientId);
  }

  @Post('test-requests')
  @UseGuards(JwtAuthGuard)
  async createLabRequest(
    @Body() data: { patientId: string; doctorId: string; labTestName: string; priority: string; labId: string },
    @Request() req: any
  ) {
    return this.hospitalService.createLabRequest(req.user.email, data);
  }

  // --- Reports Module APIs ---

  @Get('reports/patients')
  @UseGuards(JwtAuthGuard)
  async getHospitalPatients(@Request() req: any) {
    return this.hospitalService.getHospitalPatients(req.user.email);
  }

  @Get('reports/lab-reports')
  @UseGuards(JwtAuthGuard)
  async getReceivedLabReports(@Request() req: any) {
    return this.hospitalService.getReceivedLabReports(req.user.email);
  }

  @Get('reports/patient/:id')
  @UseGuards(JwtAuthGuard)
  async getPatientWithReports(@Param('id') patientId: string, @Request() req: any) {
    return this.hospitalService.getPatientWithReports(req.user.email, patientId);
  }

  @Post('reports/upload-new')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadNewPatientReport(
    @Body() data: any,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.hospitalService.uploadNewPatientReport(req.user.email, data, file);
  }

  @Post('reports/upload/:patientId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadReportForPatient(
    @Param('patientId') patientId: string,
    @Body() data: any,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.hospitalService.uploadReportForPatient(req.user.email, patientId, data, file);
  }

  // --- Billing & Payments Module APIs ---

  @Get('billing/patients')
  async getBillingPatients() {
    return this.hospitalService.getBillingPatients('');
  }

  @Get('billing/invoices')
  async getInvoices() {
    return this.hospitalService.getInvoices('');
  }

  @Post('billing/invoice')
  async createInvoice(@Body() data: any) {
    return this.hospitalService.createInvoice('', data);
  }

  // --- Departments Module APIs ---

  @Get('departments')
  async getDepartments() {
    return this.hospitalService.getDepartments('');
  }

  // --- Notifications Module APIs ---

  @Get('notifications')
  async getNotifications() {
    return this.hospitalService.getNotifications('');
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead() {
    return this.hospitalService.markAllNotificationsAsRead('');
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.hospitalService.markNotificationAsRead('', id);
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string) {
    return this.hospitalService.deleteNotification('', id);
  }

  // --- Analytics Module APIs ---

  @Get('analytics')
  async getAnalytics() {
    return this.hospitalService.getAnalytics('');
  }

  // --- Profile Module APIs ---
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getHospitalProfile(@Request() req: any) {
    return this.hospitalService.getHospitalProfile(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateHospitalProfile(@Request() req: any, @Body() data: any) {
    return this.hospitalService.updateHospitalProfile(req.user.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/password')
  async updatePassword(@Request() req: any, @Body() data: any) {
    return this.hospitalService.updatePassword(req.user.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return { url: `/uploads/${file.filename}` };
  }
}
