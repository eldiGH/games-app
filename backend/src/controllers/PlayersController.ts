import { getCurrentPlayerMapper } from '@shared/schemas';
import { controller, endpointFactory } from '../helpers';
import { PlayersService } from '../services';

export const PlayersController = controller('/players');
const endpoint = endpointFactory(PlayersController);

endpoint(
  { name: 'Get current player data', path: '/me', method: 'get', auth: true },
  async (_, res) => {
    const player = await PlayersService.findPlayerById(res.locals.player.id);

    res.send(getCurrentPlayerMapper(player));
  }
);
