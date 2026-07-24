import { Module } from '@nestjs/common';
import { MysqlModule } from '../mysql.module';
import {
  CareController,
  DocumentVerificationController,
} from './care.controller';
import { CareService } from './care.service';

@Module({
  imports: [MysqlModule],
  controllers: [CareController, DocumentVerificationController],
  providers: [CareService],
})
export class CareModule {}
