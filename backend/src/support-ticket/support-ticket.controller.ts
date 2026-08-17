import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming there's a standard JWT guard
import { ManagementAuthGuard } from '../management/management-auth.guard';

@Controller('support-tickets')
@UseGuards(JwtAuthGuard)
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Post()
  createTicket(@Request() req: any, @Body() data: { category: string, subject: string, description: string, priority: string, attachment?: string }) {
    return this.supportTicketService.createTicket(req.user.email, data);
  }

  @Get('my')
  getMyTickets(@Request() req: any) {
    return this.supportTicketService.getMyTickets(req.user.email);
  }

  @Get()
  @UseGuards(ManagementAuthGuard)
  getAllTickets() {
    return this.supportTicketService.getAllTickets();
  }

  @Get('notifications')
  @UseGuards(ManagementAuthGuard)
  getSupportNotifications() {
    return this.supportTicketService.getSupportNotifications();
  }

  @Post('notifications/mark-read')
  @UseGuards(ManagementAuthGuard)
  markSupportNotificationsRead() {
    return this.supportTicketService.markSupportNotificationsRead();
  }

  @Get(':id')
  @UseGuards(ManagementAuthGuard)
  getTicketDetails(@Param('id') id: string) {
    return this.supportTicketService.getTicketDetails(id);
  }

  @Put(':id/status')
  @UseGuards(ManagementAuthGuard)
  updateTicketStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.supportTicketService.updateTicketStatus(id, data.status);
  }

  @Put(':id/details')
  @UseGuards(ManagementAuthGuard)
  updateTicketDetails(@Param('id') id: string, @Body() data: { assignedTo: string, internalNotes: string }) {
    return this.supportTicketService.updateTicketDetails(id, data.assignedTo, data.internalNotes);
  }

  @Post(':id/reply')
  addReply(@Param('id') id: string, @Request() req: any, @Body() data: { message: string }) {
    return this.supportTicketService.addReply(id, req.user.email, data.message);
  }
}
