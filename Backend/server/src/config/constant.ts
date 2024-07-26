enum STATUS_CODES {
  'OK' = 200,
  'CLIENT_ERROR' = 400,
  'RESOURCE_NOT_FOUND' = 404,
  'SERVER_ERROR' = 500,
}

const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: 'JAVASCRIPT',
  PYTHON: 'PYTHON',
} as const;

const TIME_OUT: number = 5000;

const QUEUE_NAME: string = 'CODE_EXECUTION_QUEUE';

const EXTENSIONS: { [key in keyof typeof SUPPORTED_LANGUAGES]: string } = {
  [SUPPORTED_LANGUAGES.JAVASCRIPT]: '.js',
  [SUPPORTED_LANGUAGES.PYTHON]: '.py',
};

const PATH = {
  SRC: `${process.cwd()}/files/`,
};

export {
  SUPPORTED_LANGUAGES,
  TIME_OUT,
  QUEUE_NAME,
  EXTENSIONS,
  PATH,
  STATUS_CODES,
};
