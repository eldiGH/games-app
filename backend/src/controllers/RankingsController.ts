import { getRankingResponseMapper } from '@shared/schemas';
import { HttpStatus } from '@shared/types';
import { controller, endpointFactory } from '../helpers';
import type { GameType } from '@prisma/client';
import { RankingsService } from '../services/RankingsService';

export const RankingsController = controller('/rankings');
const endpoint = endpointFactory(RankingsController);

endpoint(
  {
    name: 'get ranking table for game',
    path: '/:gameType',
    method: 'get',
    auth: true
  },
  async (req, res) => {
    const gameType = (req.params as { gameType: GameType }).gameType.toUpperCase() as GameType;

    const ranking = await RankingsService.getRankingsForGame(gameType);

    res.status(HttpStatus.OK).send(ranking.map(getRankingResponseMapper));
  }
);
