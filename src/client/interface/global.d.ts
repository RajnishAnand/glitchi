declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN?: string;
      ACOKEY: string;
      UNSPLASH: string;
      GEMINI_TOKEN: string;

      HTTPSERVER?: '1';
      BETA?: '1';
      PROTECTED?: '1';
    }
  }
}

export {};
