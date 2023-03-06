import { NotAuthorized } from '../errors/index.js';
import { authenticate } from '../helpers/auth.js';
import type { Middleware } from '../types/index.js';

export const authMiddleware: Middleware = async (req, res, next) => {
	try {
		const player = await authenticate(req.headers);

		res.locals.player = player;
		next();
	} catch (e) {
		return next(NotAuthorized());
	}
};
