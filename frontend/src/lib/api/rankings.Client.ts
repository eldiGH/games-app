import type { GameType } from '@prisma/client';
import { getClient } from './client';
import type { GetRankingResponse } from '@shared/schemas';

const client = getClient('rankings');

export const getRankings = (gameType: GameType) => client.get<GetRankingResponse>(`/${gameType}`);
