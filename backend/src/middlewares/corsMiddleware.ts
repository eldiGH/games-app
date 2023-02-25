import cors, { type CorsOptions } from 'cors';

const config: CorsOptions = {
	origin: 'http://localhost:5173'
};

export const corsMiddleware = cors(config);
