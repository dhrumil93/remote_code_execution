import { redisClient } from '../utils/RedisClient.util.js';
import logger from '../utils/logger.util.js';
import zlib from 'zlib';

interface RedisCacheMiddlewareOptions {
  EX?: number; // the specified expire time in seconds
  PX?: number; // the specified expire time in milliseconds
  EXAT?: number; // the specified Unix time at which the key will expire, in seconds
  PXAT?: number; // the specified Unix time at which the key will expire, in milliseconds
  NX?: boolean; // write the data only if the key does not already exist
  XX?: boolean; // write the data only if the key already exists
  KEEPTTL?: boolean; // retain the TTL associated with the key
  GET?: boolean; // return the old string stored at key, or "undefined" if key did not exist
}

function isRedisWorking(): boolean {
  return !!redisClient?.isOpen;
}

async function writeData(
  key: string,
  data: any,
  options: RedisCacheMiddlewareOptions,
  compress: boolean = true,
): Promise<void> {
  if (isRedisWorking() && redisClient) {
    let dataToCache = data;
    if (compress) {
      dataToCache = zlib.deflateSync(data).toString('base64');
    }

    try {
      await redisClient.set(key, dataToCache, options as any);
    } catch (e) {
      logger.error(`Failed to cache data for key=${key}`, e);
    }
  }
}

export { writeData, isRedisWorking };
