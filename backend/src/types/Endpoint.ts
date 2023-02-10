import type { Request, Response } from 'express';
import type { HttpMethods } from './HttpMethod';

export interface Endpoint {
	path: string;
	method: HttpMethods;
	callback: (req: Request, res: Response) => Promise<void>;
}
