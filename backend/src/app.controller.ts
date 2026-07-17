import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/redis')
  async getRedisHealth() {
    const connected = await this.redisService.ping();

    return {
      service: 'redis',
      status: connected ? 'connected' : 'unavailable',
      connected,
    };
  }
}
