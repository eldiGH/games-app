import { NotAuthorized } from '../errors/index.js';
import { authenticate } from '../helpers/auth.js';
import type { Middleware } from '../types/index.js';

export const authMiddleware: Middleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) throw NotAuthorized();

		const [bearer, token] = authHeader.split(' ');

		if (!bearer || !token || bearer !== 'Bearer') throw NotAuthorized();

		const player = await authenticate(token);

		res.locals.player = player;
		next();
	} catch (e) {
		return next(NotAuthorized());
	}
};
