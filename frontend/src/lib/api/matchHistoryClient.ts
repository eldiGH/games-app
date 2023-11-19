import type { GameType } from '@prisma/client';
import { getClient } from './client';
import type { GetMatchHistoryResponse } from '@shared/schemas';

const client = getClient('match-history');

export const getMatchHistory = (gameType: GameType) =>
  client.get<GetMatchHistoryResponse>(`/${gameType}`);
