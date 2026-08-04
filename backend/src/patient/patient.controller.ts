import { Controller, Get, Post, Put, Body, UseGuards, Request, UploadedFile, UseInterceptors, Param, BadRequestException, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('overview')
  async getOverview(@Request() req: any) {
    return this.patientService.getOverview(req.user.email);
  }

  @Get('records')
  async getRecords(@Request() req: any) {
    return this.patientService.getRecords(req.user.email);
  }

  @Get('appointments')
  async getAppointments(@Request() req: any) {
    return this.patientService.getAppointments(req.user.email);
  }

  @Get('appointments/providers')
  async getAppointmentProviders() {
    return this.patientService.getAppointmentProviders();
  }

  @Post('appointments')
  async createAppointment(@Request() req: any, @Body() data: any) {
    return this.patientService.createAppointment(req.user.email, data);
  }

  @Put('appointments/:id/status')
  async updateAppointmentStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.patientService.updateAppointmentStatus(req.user.email, id, status);
  }

  @Post('records/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRecord(@Request() req: any, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.patientService.uploadRecord(req.user.email, file, body);
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.patientService.getProfile(req.user.email);
  }

  @Put('profile')
  async updateProfile(@Request() req: any, @Body() data: any) {
    return this.patientService.updateProfile(req.user.email, data);
  }

  @Post('profile/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileLogo(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.patientService.uploadProfileLogo(req.user.email, file);
  }

  @Get('prescriptions')
  async getPrescriptions(@Request() req: any) {
    return this.patientService.getPrescriptions(req.user.email);
  }

  @Get('prescriptions/:id/image')
  async getPrescriptionImage(@Request() req: any, @Param('id') id: string) {
    const image = await this.patientService.getPrescriptionImage(req.user.email, id);
    const safeName = String(image.fileName || 'prescription-image').replace(/["\r\n]/g, '_');
    return new StreamableFile(image.content, {
      type: image.mimeType,
      disposition: `inline; filename="${safeName}"`,
      length: Number(image.sizeBytes),
    });
  }

  @Post('prescriptions')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      const accepted = allowed.includes(file.mimetype);
      callback(accepted ? null : new BadRequestException('Only JPG, PNG or WebP prescription images are allowed.'), accepted);
    },
  }))
  async createPrescription(@Request() req: any, @UploadedFile() file: Express.Multer.File | undefined, @Body() data: any) {
    return this.patientService.createPrescription(req.user.email, data, file);
  }

  @Get('access-requests')
  async getAccessRequests(@Request() req: any) {
    return this.patientService.getAccessRequests(req.user.email);
  }

  @Put('access-requests/:id')
  async updateAccessRequestStatus(
    @Request() req: any, 
    @Param('id') id: string,
    @Body() data: { status: string; reportIds?: string[] },
  ) {
    return this.patientService.updateAccessRequestStatus(req.user.email, id, data.status, data.reportIds || []);
  }

  @Get('notifications')
  async getNotifications(@Request() req: any) {
    return this.patientService.getNotifications(req.user.email);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@Request() req: any) {
    return this.patientService.markAllNotificationsAsRead(req.user.email);
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Request() req: any, @Param('id') id: string) {
    return this.patientService.markNotificationAsRead(req.user.email, id);
  }
}
