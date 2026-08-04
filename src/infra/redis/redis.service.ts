import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import {
  REDIS_RETRY_BASE_DELAY_MS,
  REDIS_RETRY_MAX_DELAY_MS,
  REDIS_MAX_RETRIES_PER_REQUEST,
} from './redis.constants';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379',
      {
        retryStrategy: (times) =>
          Math.min(times * REDIS_RETRY_BASE_DELAY_MS, REDIS_RETRY_MAX_DELAY_MS),
        maxRetriesPerRequest: REDIS_MAX_RETRIES_PER_REQUEST,
      },
    );

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis error', err);
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.ping();
    } catch (err) {
      this.logger.error('Failed to connect to Redis', err);
    }
  }

  // Sets a value in Redis with an optional TTL
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redisClient.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, data);
    }
  }

  // Gets a value from Redis, returning null if not found
  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  // Deletes a key from Redis
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
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
