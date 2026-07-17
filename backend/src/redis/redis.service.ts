import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private readonly defaultTtlSeconds = Number(
    process.env.REDIS_CACHE_TTL_SECONDS || 300,
  );

  onModuleInit() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1, // Fail fast if Redis is down
        retryStrategy(times) {
          if (times > 3) {
            // Stop retrying after 3 attempts
            return null;
          }
          return Math.min(times * 1000, 3000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Redis connected successfully.');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error (fallback to DB): ${err.message}`);
      });
      
      this.client.on('end', () => {
        this.isConnected = false;
      });
    } catch (error) {
      this.logger.warn('Failed to initialize Redis. Continuing without caching.');
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  /**
   * Check if Redis is healthy and connected.
   */
  isHealthy(): boolean {
    return this.isConnected && this.client !== null;
  }

  async ping(): Promise<boolean> {
    if (!this.isHealthy() || !this.client) return false;

    try {
      return (await this.client.ping()) === 'PONG';
    } catch {
      return false;
    }
  }

  /**
   * Get value from cache. Returns null if missing or if Redis is down.
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isHealthy() || !this.client) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      this.logger.warn(`Redis GET error for key ${key}: ${err.message}`);
      return null; // Fallback gracefully
    }
  }

  /**
   * Set value in cache with TTL (in seconds).
   */
  async set(
    key: string,
    value: unknown,
    ttlSeconds: number = this.defaultTtlSeconds,
  ): Promise<void> {
    if (!this.isHealthy() || !this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      this.logger.warn(`Redis SET error for key ${key}: ${err.message}`);
    }
  }

  /**
   * Delete specific key.
   */
  async del(key: string): Promise<void> {
    if (!this.isHealthy() || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(`Redis DEL error for key ${key}: ${err.message}`);
    }
  }

  /** Delete keys matching a pattern without blocking Redis. */
  async delPattern(pattern: string): Promise<void> {
    if (!this.isHealthy() || !this.client) return;
    try {
      let cursor = '0';

      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) await this.client.del(...keys);
      } while (cursor !== '0');
    } catch (err) {
      this.logger.warn(`Redis DEL PATTERN error for ${pattern}: ${err.message}`);
    }
  }
}
