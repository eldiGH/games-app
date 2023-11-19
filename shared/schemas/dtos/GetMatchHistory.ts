import type { MatchHistory, Player, Ranking } from '@prisma/client';

type MatchHistoryWithIncludes = MatchHistory & {
  loser: Player & {
    rankings: Ranking[];
  };
  winner: Player & {
    rankings: Ranking[];
  };
};

interface MatchHistoryOpponent {
  name: string;
  ranking: {
    before: number;
    after: number;
    current: number;
  };
}

interface MatchHistoryPlayerRanking {
  before: number;
  after: number;
}

interface GetMatchHistoryItem {
  transferredPoints: number;
  date: Date;
  won: boolean;
  opponent: MatchHistoryOpponent;
  playerRanking: MatchHistoryPlayerRanking;
}

export type GetMatchHistoryResponse = GetMatchHistoryItem[];

export const getMatchHistoryMapper = (
  matchHistories: MatchHistoryWithIncludes[],
  playerId: number
): GetMatchHistoryResponse =>
  matchHistories.map(
    ({ date, loser, winner, transferredPoints, loserRatingBefore, winnerRatingBefore }) => {
      let opponent: MatchHistoryOpponent;
      let playerRanking: MatchHistoryPlayerRanking;
      let won: boolean;

      if (winner.id === playerId) {
        opponent = {
          name: loser.nickname,
          ranking: {
            current: loser.rankings[0].value,
            before: loserRatingBefore,
            after: loserRatingBefore - transferredPoints
          }
        };
        playerRanking = {
          before: winnerRatingBefore,
          after: winnerRatingBefore + transferredPoints
        };
        won = true;
      } else {
        opponent = {
          name: winner.nickname,
          ranking: {
            current: winner.rankings[0].value,
            before: winnerRatingBefore,
            after: winnerRatingBefore + transferredPoints
          }
        };
        playerRanking = { before: loserRatingBefore, after: loserRatingBefore - transferredPoints };
        won = false;
      }

      return {
        date,
        transferredPoints,
        won,
        opponent,
        playerRanking
      };
    }
  );
