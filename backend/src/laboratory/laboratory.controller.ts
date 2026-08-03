import { Controller, Get, Put, Post, Body, Param, Query, Delete, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LaboratoryService } from './laboratory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('laboratory')
@UseGuards(JwtAuthGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Get('overview')
  async getOverview(@Request() req: any) {
    return this.laboratoryService.getOverview(req.user.email);
  }

  @Get('test-requests')
  async getTestRequests(@Request() req: any) {
    return this.laboratoryService.getTestRequests(req.user.email);
  }

  @Put('test-requests/:id/status')
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
    @Request() req: any
  ) {
    return this.laboratoryService.updateRequestStatus(req.user.email, id, data.status);
  }

  @Get('reports')
  async getReports(@Request() req: any) {
    return this.laboratoryService.getReports(req.user.email);
  }

  @Post('reports')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReport(@Body() data: any, @Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.laboratoryService.uploadReport(req.user.email, data, file);
  }

  // --- Samples APIs ---
  
  @Get('samples')
  async getSamples(@Request() req: any) {
    return this.laboratoryService.getSamples(req.user.email);
  }

  @Put('samples/:id/status')
  async updateSampleStatus(
    @Param('id') id: string,
    @Body() data: { status: string, rejectionReason?: string },
    @Request() req: any
  ) {
    return this.laboratoryService.updateSampleStatus(req.user.email, id, data.status, data.rejectionReason);
  }

  @Put('samples/:id/assign')
  async assignSample(
    @Param('id') id: string,
    @Body() data: { assignee: string },
    @Request() req: any
  ) {
    return this.laboratoryService.assignSample(req.user.email, id, data.assignee);
  }

  @Post('samples/:id/report')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSampleReport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.laboratoryService.uploadSampleReport(req.user.email, id, file, data);
  }

  // --- Patients APIs ---

  @Get('patients')
  async getPatients(@Request() req: any) {
    return this.laboratoryService.getPatients(req.user.email);
  }

  @Get('patients/search')
  async searchPatients(@Query('q') q: string, @Request() req: any) {
    return this.laboratoryService.searchPatients(req.user.email, q);
  }

  @Post('patients/request-access')
  async requestAccess(@Body() data: { patientId: string }, @Request() req: any) {
    return this.laboratoryService.requestAccess(req.user.email, data.patientId);
  }

  @Get('patients/:id/details')
  async getPatientDetails(@Param('id') id: string, @Request() req: any) {
    return this.laboratoryService.getPatientDetails(req.user.email, id);
  }

  @Get('patients/:id/records')
  async getPatientRecords(@Param('id') id: string, @Request() req: any) {
    return this.laboratoryService.getPatientRecords(req.user.email, id);
  }

  // --- Notifications APIs ---

  @Get('notifications')
  async getNotifications(@Request() req: any) {
    return this.laboratoryService.getNotifications(req.user.email);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@Request() req: any) {
    return this.laboratoryService.markAllNotificationsAsRead(req.user.email);
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Param('id') id: string, @Request() req: any) {
    return this.laboratoryService.markNotificationAsRead(req.user.email, id);
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string, @Request() req: any) {
    return this.laboratoryService.deleteNotification(req.user.email, id);
  }

  // --- Profile APIs ---

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.laboratoryService.getProfile(req.user.email);
  }

  @Put('profile')
  async updateProfile(@Body() data: any, @Request() req: any) {
    return this.laboratoryService.updateProfile(req.user.email, data);
  }

  @Post('profile/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileLogo(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    return this.laboratoryService.uploadProfileLogo(req.user.email, file);
  }
}
