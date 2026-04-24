import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';

@Injectable()
export class LocalCacheService {
  private readonly cache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120,
    useClones: false,
    deleteOnExpire: true,
  });

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    if (typeof ttlSeconds === 'number') {
      return this.cache.set(key, value, ttlSeconds);
    }

    return this.cache.set(key, value);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getTtl(key: string): number | undefined {
    return this.cache.getTtl(key);
  }

  stats() {
    return this.cache.getStats();
  }
}
