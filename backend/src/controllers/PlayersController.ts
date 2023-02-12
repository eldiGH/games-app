import { getCurrentPlayerMapper, getMyFriendsMapper } from '@shared/schemas';
import { controller, endpointFactory } from '../helpers';
import { PlayersService } from '../services';

export const PlayersController = controller('/players');
const endpoint = endpointFactory(PlayersController);

endpoint(
	{ name: 'Get current player data', path: '/me', method: 'get', auth: true },
	async (_, res) => {
		const player = await PlayersService.findPlayerById(res.locals.id);

		res.send(getCurrentPlayerMapper(player));
	}
);

endpoint(
	{ name: 'Get my friends', path: '/me/friends', method: 'get', auth: true },
	async (_req, res) => {
		const player = await PlayersService.getPlayerWithFriends(res.locals.id);

		res.send(getMyFriendsMapper(player));
	}
);
