import { UrlNotFound } from '../errors/UrlNotFound';
import type { Middleware } from '../types/Middleware';

export const notFoundMiddleware: Middleware = (req, _res, next) => {
	next(UrlNotFound(req.path));
};
