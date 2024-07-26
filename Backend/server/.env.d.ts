declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CORS_ORIGIN: string;
    }
  }
}

export {};
