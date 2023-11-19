import { getMatchHistoryMapper } from '@shared/schemas';
import { HttpStatus } from '@shared/types';
import { controller, endpointFactory } from '../helpers';
import { MatchHistoryService } from '../services/MatchHistoryService';
import type { GameType } from '@prisma/client';

export const MatchHistoryController = controller('/match-history');
const endpoint = endpointFactory(MatchHistoryController);

endpoint(
  {
    name: 'get whole history',
    path: '/:gameType',
    method: 'get',
    auth: true
  },
  async (req, res) => {
    const gameType = (req.params as { gameType: GameType }).gameType.toUpperCase() as GameType;

    const history = await MatchHistoryService.getHistory(res.locals.player.id, gameType);

    res.status(HttpStatus.OK).send(getMatchHistoryMapper(history, res.locals.player.id));
  }
);
