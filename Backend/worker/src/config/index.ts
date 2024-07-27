export enum STATUS_CODES {
  'OK' = 200,
  'CLIENT_ERROR' = 400,
  'RESOURCE_NOT_FOUND' = 404,
  'SERVER_ERROR' = 500,
}

export const ENV_VARIABLE = {
  REDIS_PASS: process.env.REDIS_PASS,
  REDIS_URL: process.env.REDIS_URL,
  CACHE_EXPIRY_SECONDS: 1000 * 60,
};

export const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: '.js',
  JAVA: '.java',
  PYTHON: '.py',
} as const;

export const TIME_OUT: number = 5000;

export const QUEUE_NAME: string = 'CODE_EXECUTION_ENGINE';

export const PATHS = {
  SRC: `${process.cwd()}/files/`,
};
