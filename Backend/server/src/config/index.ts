export enum STATUS_CODES {
  'OK' = 200,
  'CLIENT_ERROR' = 400,
  'RESOURCE_NOT_FOUND' = 404,
  'SERVER_ERROR' = 500,
}

export const ENV_VARIABLE = {
  REDIS_PASS: process.env.REDIS_PASS,
  REDIS_URL: process.env.REDIS_URL,
};

export const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: 'JAVASCRIPT',
  PYTHON: 'PYTHON',
  JAVA: 'JAVA'
} as const;

export type SupportedLanguages = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export const TIME_OUT: number = 5000;

export const QUEUE_NAME: string = 'CODE_EXECUTION_ENGINE';

export const EXTENSIONS: { [key in SupportedLanguages]: string } = {
  [SUPPORTED_LANGUAGES.JAVASCRIPT]: '.js',
  [SUPPORTED_LANGUAGES.PYTHON]: '.py',
  [SUPPORTED_LANGUAGES.JAVA]: '.java',
};

export const PATH = {
  SRC: `${process.cwd()}/files/`,
};
