declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN ?: string;
      FIRE ?: string;
      ACOKEY : string;
      API0 :string ;
      UNSPLASH : string;

      HTTPSERVER ?: '1' | '0';
      BETA ?: '1' | '0';
    }
  }
}

export {};
