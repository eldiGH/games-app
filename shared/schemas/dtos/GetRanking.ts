import type { Player, Ranking } from '@prisma/client';

export interface GetRankingItem {
  value: number;
  player: string;
  won: number;
  lost: number;
}

export type GetRankingResponse = GetRankingItem[];

export const getRankingResponseMapper = (
  ranking: Ranking & {
    player: Player & {
      _count: {
        won: number;
        lost: number;
      };
    };
  }
): GetRankingItem => ({
  player: ranking.player.nickname,
  value: ranking.value,
  won: ranking.player._count.won,
  lost: ranking.player._count.lost
});
