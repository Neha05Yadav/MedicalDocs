/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CareService } from './care.service';

@Controller('care')
@UseGuards(JwtAuthGuard)
export class CareController {
  constructor(private readonly care: CareService) {}

  @Get('appointments/providers')
  providers() {
    return this.care.providers();
  }

  @Get('appointments/availability')
  availability(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.care.availability(doctorId, date);
  }

  @Get('appointments/availability-rules')
  availabilityRules(@Request() req: any) {
    return this.care.availabilityRules(req.user);
  }

  @Post('appointments/availability-rules')
  saveAvailabilityRule(@Request() req: any, @Body() body: any) {
    return this.care.saveAvailabilityRule(req.user, body);
  }

  @Get('appointments')
  appointments(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.care.appointments(req.user, from, to);
  }

  @Post('appointments')
  createAppointment(@Request() req: any, @Body() body: any) {
    return this.care.createAppointment(req.user, body);
  }

  @Patch('appointments/:id/reschedule')
  reschedule(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.care.rescheduleAppointment(req.user, id, body);
  }

  @Patch('appointments/:id/status')
  appointmentStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.care.updateAppointmentLifecycle(req.user, id, body);
  }

  @Get('lab/catalog')
  labCatalog(
    @Request() req: any,
    @Query('laboratoryId') laboratoryId?: string,
  ) {
    return this.care.labCatalog(req.user, laboratoryId);
  }

  @Get('lab/providers')
  labProviders() {
    return this.care.labProviders();
  }

  @Post('lab/catalog')
  saveLabTest(@Request() req: any, @Body() body: any) {
    return this.care.saveLabTest(req.user, body);
  }

  @Patch('lab/catalog/:id')
  updateLabTest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.care.updateLabTest(req.user, id, body);
  }

  @Post('lab/packages')
  saveLabPackage(@Request() req: any, @Body() body: any) {
    return this.care.saveLabPackage(req.user, body);
  }

  @Post('lab/orders')
  createLabOrder(@Request() req: any, @Body() body: any) {
    return this.care.createLabOrder(req.user, body);
  }

  @Get('lab/orders')
  labOrders(@Request() req: any) {
    return this.care.labOrders(req.user);
  }

  @Patch('lab/orders/:id/sample')
  updateSample(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.care.updateSample(req.user, id, body);
  }

  @Post('lab/orders/:id/complete')
  completeLabOrder(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.care.completeLabOrder(req.user, id, body);
  }

  @Get('lab/orders/:id/label')
  async sampleLabel(@Request() req: any, @Param('id') id: string) {
    const result = await this.care.sampleLabel(req.user, id);
    return new StreamableFile(result.content, {
      type: result.mimeType,
      disposition: `inline; filename="${result.fileName}"`,
    });
  }

  @Get('inpatient/workspace')
  inpatientWorkspace(@Request() req: any) {
    return this.care.inpatientWorkspace(req.user);
  }

  @Post('inpatient/rooms')
  saveRoom(@Request() req: any, @Body() body: any) {
    return this.care.saveRoom(req.user, body);
  }

  @Post('inpatient/admissions')
  admit(@Request() req: any, @Body() body: any) {
    return this.care.admitPatient(req.user, body);
  }

  @Post('inpatient/admissions/:id/charges')
  addAdmissionCharge(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.care.addAdmissionCharge(req.user, id, body);
  }

  @Post('inpatient/admissions/:id/discharge')
  discharge(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.care.dischargePatient(req.user, id, body);
  }

  @Get('insurance/workspace')
  insuranceWorkspace(@Request() req: any) {
    return this.care.insuranceWorkspace(req.user);
  }

  @Post('insurance/policies')
  savePolicy(@Request() req: any, @Body() body: any) {
    return this.care.savePolicy(req.user, body);
  }

  @Post('insurance/claims')
  createClaim(@Request() req: any, @Body() body: any) {
    return this.care.createClaim(req.user, body);
  }

  @Patch('insurance/claims/:id')
  updateClaim(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.care.updateClaim(req.user, id, body);
  }

  @Post('insurance/claims/:id/documents')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  uploadClaimDocument(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
  ) {
    return this.care.uploadClaimDocument(req.user, id, documentType, file);
  }

  @Get('documents/:type/:id/pdf')
  async documentPdf(
    @Request() req: any,
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    const result = await this.care.documentPdf(req.user, type, id);
    return new StreamableFile(result.content, {
      type: 'application/pdf',
      disposition: `attachment; filename="${result.fileName}"`,
    });
  }
}

@Controller('documents/verify')
export class DocumentVerificationController {
  constructor(private readonly care: CareService) {}

  @Get(':token')
  verify(@Param('token') token: string) {
    return this.care.verifyDocument(token);
  }
}
