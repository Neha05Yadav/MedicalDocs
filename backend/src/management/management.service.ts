import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql.service';

@Injectable()
export class ManagementService {
  constructor(private db: MysqlService) {}

  async getStatus() {
    return {
      status: 'online',
      module: 'Management'
    };
  }
}
