import * as redis from 'redis';
import { RedisClientType } from 'redis';
import logger from './logger.util';
import { ENV_VARIABLE } from 'src/config/index';

const redisConfig = {
  url: ENV_VARIABLE.REDIS_URL,
  pass: ENV_VARIABLE.REDIS_PASS,
};

export let redisClient: RedisClientType | undefined;

async function initializeRedisClient(): Promise<void> {
  if (!redisConfig.url) {
    logger.error('Redis Connection URL is Missing');
    return;
  }

  redisClient = redis.createClient({
    url: redisConfig.url,
    password: redisConfig.pass,
  });

  redisClient.on('error', (err: Error) => {
    logger.error(`Error While Connecting redis`, err);
  });

  try {
    await redisClient.connect();
    logger.info('Redis Client Connected Successfully');
  } catch (error: any) {
    logger.error('Failed to Connect Redis Client');
    logger.error(error);
  }
}

export default initializeRedisClient;
