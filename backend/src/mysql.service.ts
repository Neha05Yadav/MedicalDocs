import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/medico',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  // Helper method to execute queries
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this.pool.execute(sql, params);
    return rows as T[];
  }
  
  // Helper for single row
  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    if (rows && rows.length > 0) return rows[0];
    return null;
  }
  
  // Helper to expose the raw pool if needed for transactions
  getPool(): mysql.Pool {
    return this.pool;
  }
}
