import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming there's a standard JWT guard

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
  getAllTickets() {
    return this.supportTicketService.getAllTickets();
  }

  @Get('notifications')
  getSupportNotifications() {
    return this.supportTicketService.getSupportNotifications();
  }

  @Post('notifications/mark-read')
  markSupportNotificationsRead() {
    return this.supportTicketService.markSupportNotificationsRead();
  }

  @Get(':id')
  getTicketDetails(@Param('id') id: string) {
    return this.supportTicketService.getTicketDetails(id);
  }

  @Put(':id/status')
  updateTicketStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.supportTicketService.updateTicketStatus(id, data.status);
  }

  @Put(':id/details')
  updateTicketDetails(@Param('id') id: string, @Body() data: { assignedTo: string, internalNotes: string }) {
    return this.supportTicketService.updateTicketDetails(id, data.assignedTo, data.internalNotes);
  }

  @Post(':id/reply')
  addReply(@Param('id') id: string, @Request() req: any, @Body() data: { message: string }) {
    return this.supportTicketService.addReply(id, req.user.email, data.message);
  }
}
