import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hospital')
@UseGuards(JwtAuthGuard)
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('overview')
  async getOverview(@Request() req: any) {
    return this.hospitalService.getOverview(req.user.email);
  }

  @Post('add-treatment-patient')
  async addTreatmentPatient(@Request() req: any, @Body() data: any) {
    return this.hospitalService.addTreatmentPatient(req.user.email, data);
  }

  @Put('update-treatment-patient')
  async updateTreatmentPatient(@Request() req: any, @Body() data: any) {
    return this.hospitalService.updateTreatmentPatient(req.user.email, data);
  }

  @Get('labs')
  async getLabs() {
    return this.hospitalService.getAllLabs();
  }
  //@UseGuards(JwtAuthGuard)
  @Get('doctors')
  async getDoctors(@Request() req: any) {
    try {
      return await this.hospitalService.getDoctors(req.user.email);
    } catch (error) {
      console.error("GET DOCTORS ERROR:", error);
      throw error;
    }
  }

  @Post('doctors')
  async addDoctor(@Request() req: any, @Body() data: any) {
    return this.hospitalService.addDoctor(req.user.email, data);
  }

  @Put('doctors/:id')
  async updateDoctor(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.hospitalService.updateDoctor(req.user.email, id, data);
  }

  @Delete('doctors/:id')
  async deleteDoctor(@Request() req: any, @Param('id') id: string) {
    return this.hospitalService.deleteDoctor(req.user.email, id);
  }

  @Get('search-patients')
  async searchPatients(@Request() req: any, @Query('q') q: string) {
    return this.hospitalService.searchPatients(req.user.email, q);
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
  async getBillingPatients(@Request() req: any) {
    return this.hospitalService.getBillingPatients(req.user.email);
  }

  @Get('billing/invoices')
  async getInvoices(@Request() req: any) {
    return this.hospitalService.getInvoices(req.user.email);
  }

  @Post('billing/invoice')
  async createInvoice(@Request() req: any, @Body() data: any) {
    return this.hospitalService.createInvoice(req.user.email, data);
  }

  // --- Departments Module APIs ---

  @Get('departments')
  async getDepartments(@Request() req: any) {
    return this.hospitalService.getDepartments(req.user.email);
  }

  // --- Notifications Module APIs ---

  @Get('notifications')
  async getNotifications(@Request() req: any) {
    return this.hospitalService.getNotifications(req.user.email);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@Request() req: any) {
    return this.hospitalService.markAllNotificationsAsRead(req.user.email);
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Request() req: any, @Param('id') id: string) {
    return this.hospitalService.markNotificationAsRead(req.user.email, id);
  }

  @Delete('notifications/:id')
  async deleteNotification(@Request() req: any, @Param('id') id: string) {
    return this.hospitalService.deleteNotification(req.user.email, id);
  }

  // --- Analytics Module APIs ---

  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    return this.hospitalService.getAnalytics(req.user.email);
  }

  @Get('subscription')
  async getSubscription(@Request() req: any) {
    return this.hospitalService.getSubscription(req.user.email);
  }

  @Put('subscription')
  async changeSubscription(@Request() req: any, @Body('planId') planId: string) {
    return this.hospitalService.changeSubscription(req.user.email, planId);
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
  async uploadLogo(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.hospitalService.updateHospitalLogo(req.user.email, file);
  }
}
