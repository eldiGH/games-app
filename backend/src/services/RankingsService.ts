import type { GameType } from '@prisma/client';
import { db } from '../db';
import { PlayerNotFound } from '../errors';

const K_FACTOR = 32;

export const defaultRankingFactory = (gameType: GameType, playerId: number) => ({
  game: gameType,
  value: 1000,
  playerId
});

export const RankingsService = {
  updateRankings: async (winnerId: number, loserId: number, gameType: GameType) => {
    const winner = await db.player.findUnique({
      where: { id: winnerId },
      include: { rankings: { where: { game: gameType } } }
    });
    const loser = await db.player.findUnique({
      where: { id: loserId },
      include: { rankings: { where: { game: gameType } } }
    });

    if (!winner || !loser) {
      throw PlayerNotFound();
    }

    let winnerRanking = winner.rankings[0];
    let loserRanking = loser.rankings[0];

    if (!winnerRanking) {
      winnerRanking = await db.ranking.create({
        data: defaultRankingFactory(gameType, winnerId)
      });
    }

    if (!loserRanking) {
      loserRanking = await db.ranking.create({
        data: defaultRankingFactory(gameType, loserId)
      });
    }

    const probabilityOfWinning =
      1 / (1 + Math.pow(10, (loserRanking.value - winnerRanking.value) / 400));
    const pointsToTransfer = Math.round(K_FACTOR * (1 - probabilityOfWinning));

    const newWinnerRankingValue = winnerRanking.value + pointsToTransfer;
    const newLoserRankingValue = loserRanking.value - pointsToTransfer;

    await db.ranking.update({
      where: { id: winnerRanking.id },
      data: { value: newWinnerRankingValue }
    });
    await db.ranking.update({
      where: { id: loserRanking.id },
      data: { value: newLoserRankingValue }
    });

    await db.matchHistory.create({
      data: {
        game: gameType,
        loserRatingBefore: loserRanking.value,
        winnerRatingBefore: winnerRanking.value,
        transferedPoints: pointsToTransfer,
        loserId,
        winnerId
      }
    });
  }
};
