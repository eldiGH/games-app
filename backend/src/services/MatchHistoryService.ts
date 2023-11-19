import type { GameType } from '@prisma/client';
import { db } from '../db';

export const MatchHistoryService = {
  getHistory: async (playerId: number, gameType: GameType) =>
    db.matchHistory.findMany({
      where: { game: gameType, OR: [{ loserId: playerId }, { winnerId: playerId }] },
      orderBy: { date: 'desc' },
      include: {
        loser: { include: { rankings: { where: { game: gameType } } } },
        winner: { include: { rankings: { where: { game: gameType } } } }
      }
    })
};
