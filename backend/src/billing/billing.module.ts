import { Module } from '@nestjs/common';
import { MysqlModule } from '../mysql.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [MysqlModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
