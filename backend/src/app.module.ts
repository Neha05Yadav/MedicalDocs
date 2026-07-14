import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HospitalModule } from './hospital/hospital.module';
import { ClinicModule } from './clinic/clinic.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { ManagementModule } from './management/management.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';

@Module({
  imports: [
    MysqlModule,
    AuthModule, 
    PatientModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    HospitalModule,
    ClinicModule,
    LaboratoryModule,
    ManagementModule,
    SupportTicketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
