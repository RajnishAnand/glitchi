declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN?: string;
			ACOKEY: string;
			UNSPLASH: string;

			HTTPSERVER?: '1';
			BETA?: '1';
			PROTECTED?: '1';
		}
	}
}

export {};
