import type { JwtPayload } from 'jsonwebtoken';
import { NotAuthorized } from '../errors';
import jwt from 'jsonwebtoken';
import type { IncomingHttpHeaders } from 'http';
import { PlayersService } from '../services';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET NOT FOUND');

export const authenticate = async (headers: IncomingHttpHeaders) => {
	const authHeader = headers.authorization;

	if (!authHeader) throw NotAuthorized();

	const [bearer, token] = authHeader.split(' ');

	if (!bearer || !token || bearer !== 'Bearer') throw NotAuthorized();

	const decodedJwt = jwt.verify(token, jwtSecret) as JwtPayload;

	const player = await PlayersService.findPlayerById(decodedJwt.id);
	if (!player) throw NotAuthorized();

	return player;
};
