import type { NextFunction, Request, Response } from 'express';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
