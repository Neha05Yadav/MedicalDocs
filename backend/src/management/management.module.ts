import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { SuperAdminController } from './super-admin/super-admin.controller';
import { SuperAdminService } from './super-admin/super-admin.service';
import { SalesController } from './sales/sales.controller';
import { AccountsController } from './accounts/accounts.controller';
import { SupportController } from './support/support.controller';
import { ManagementAuthGuard } from './management-auth.guard';

@Module({
  controllers: [
    ManagementController,
    AdminController,
    SuperAdminController,
    SalesController,
    AccountsController,
    SupportController
  ],
  providers: [ManagementService, AdminService, SuperAdminService, ManagementAuthGuard],
})
export class ManagementModule {}
