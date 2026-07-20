import { BadRequestException, Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile, UseGuards, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ClinicService } from './clinic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clinic')
@UseGuards(JwtAuthGuard)
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get('overview')
  async getOverview() {
    return this.clinicService.getOverview();
  }

  @Get('labs')
  async getLabs() {
    return this.clinicService.getAllLabs();
  }

  @Get('patients')
  async getPatients() {
    return this.clinicService.getPatients();
  }

  @Get('patients/search')
  async searchPatients(@Query('query') query: string) {
    return this.clinicService.searchPatients(query);
  }

  @Get('my-patients')
  async getMyPatients() {
    return this.clinicService.getMyPatients();
  }

  @Post('my-patients')
  async createMyPatient(@Body() data: any) {
    return this.clinicService.createMyPatient(data);
  }

  @Put('my-patients/:id')
  async updateMyPatient(@Param('id') id: string, @Body() data: any) {
    return this.clinicService.updateMyPatient(id, data);
  }

  @Delete('my-patients/:id')
  async deleteMyPatient(@Param('id') id: string) {
    return this.clinicService.deleteMyPatient(id);
  }

  @Post('patients/request-access')
  async requestAccess(@Body() body: { patientId: string; reportTypes: string; reason: string; priority: string; duration: string; note?: string }) {
    return this.clinicService.requestAccess(body.patientId, body.reportTypes, body.reason, body.priority, body.duration, body.note || "");
  }

  @Post('patients/approve-access')
  async approveAccess(@Body() data: { requestId: string }) {
    return this.clinicService.approveAccess(data.requestId);
  }

  @Post('test-requests')
  async createLabRequest(@Body() data: { patientId: string; labTestName: string; priority: string; labId: string }) {
    return this.clinicService.createLabRequest(data);
  }

  // --- Prescriptions Module APIs ---

  @Get('prescriptions')
  async getPrescriptions() {
    return this.clinicService.getPrescriptions();
  }

  @Post('prescriptions')
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      callback(allowed.includes(file.mimetype) ? null : new BadRequestException('Only JPG, PNG or WebP prescription images are allowed.'), allowed.includes(file.mimetype));
    },
  }))
  async createPrescription(@UploadedFile() image: Express.Multer.File | undefined, @Body() data: any) {
    return this.clinicService.createPrescription(data, image);
  }

  @Get('prescriptions/:id/image')
  async getPrescriptionImage(@Param('id') id: string) {
    const image = await this.clinicService.getPrescriptionImage(id);
    const safeName = String(image.fileName || 'prescription-image').replace(/["\r\n]/g, '_');
    return new StreamableFile(image.content, {
      type: image.mimeType,
      disposition: `inline; filename="${safeName}"`,
      length: Number(image.sizeBytes),
    });
  }

  @Put('prescriptions/:id')
  async updatePrescription(@Param('id') id: string, @Body() data: any) {
    return this.clinicService.updatePrescription(id, data);
  }

  @Delete('prescriptions/:id')
  async deletePrescription(@Param('id') id: string) {
    return this.clinicService.deletePrescription(id);
  }

  @Get('patients/:id/records')
  async getPatientRecords(@Param('id') id: string) {
    return this.clinicService.getPatientRecords(id);
  }

  // --- Reports Module APIs ---

  @Get('reports')
  async getReports() {
    return this.clinicService.getReports();
  }

  @Get('reports/lab-reports')
  async getReceivedLabReports() {
    return this.clinicService.getReceivedLabReports();
  }

  @Post('reports')
  @UseInterceptors(FileInterceptor('file'))
  async createReport(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
    return this.clinicService.createReport({ ...data, fileUrl: file?.filename || null });
  }

  // --- Notifications Module APIs ---

  @Get('notifications')
  async getNotifications() {
    return this.clinicService.getNotifications();
  }

  @Put('notifications/read-all')
  async markAllNotificationsRead() {
    return this.clinicService.markAllNotificationsRead();
  }

  @Put('notifications/:id/read')
  async markNotificationRead(@Param('id') id: string) {
    return this.clinicService.markNotificationRead(id);
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string) {
    return this.clinicService.deleteNotification(id);
  }

  // --- Profile Module APIs ---

  @Get('profile')
  async getProfile() {
    return this.clinicService.getProfile();
  }

  @Put('profile')
  async updateProfile(@Body() data: any) {
    return this.clinicService.updateProfile(data);
  }

  @Post('profile/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileLogo(@UploadedFile() file: Express.Multer.File) {
    return this.clinicService.uploadProfileLogo(file);
  }
}
