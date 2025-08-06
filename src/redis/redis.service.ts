// src/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379',
      {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      },
    );

    this.redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.ping();
      console.log('Redis connection established');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }
  private parseRedisUrl(url: string): Partial<RedisOptions> {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port, 10),
        username: parsed.username || undefined,
        password: parsed.password || undefined,
        tls: parsed.protocol === 'rediss:' ? {} : undefined,
        db: parsed.pathname
          ? parseInt(parsed.pathname.slice(1), 10)
          : undefined,
      };
    } catch (e) {
      throw new Error(`Invalid REDIS_URL: ${url}`);
    }
  }

  async acquireLock(key: string, ttl: number): Promise<string | null> {
    const lock = Math.random().toString(36).substring(2);
    const result = await this.redisClient.set(key, lock, 'PX', ttl, 'NX');
    return result === 'OK' ? lock : null;
  }

  async releaseLock(key: string, lock: string): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redisClient.eval(script, 1, key, lock);
  }
}
