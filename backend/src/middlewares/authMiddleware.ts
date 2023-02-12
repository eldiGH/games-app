import type { JwtPayload } from '@shared/types';
import { verify } from 'jsonwebtoken';
import { NotAuthorized } from '../errors/index.js';
import { PlayersService } from '../services/index.js';
import type { Middleware } from '../types/index.js';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET NOT FOUND');

export const authMiddleware: Middleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) return next(NotAuthorized());

	const [bearer, token] = authHeader.split(' ');

	if (!bearer || !token || bearer !== 'Bearer') next(NotAuthorized());

	try {
		const decodedJwt = verify(token, jwtSecret) as JwtPayload;

		const player = await PlayersService.findPlayerById(decodedJwt.id);
		if (!player) return next(NotAuthorized());

		res.locals.player = player;
		next();
	} catch (e) {
		return next(NotAuthorized());
	}
};
