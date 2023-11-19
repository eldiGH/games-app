import type { GameType } from '@prisma/client';
import type { GameController, GameControllerFactory } from '@shared/types';
import {
  sendToAllClients,
  type Room,
  type RoomManager,
  type WsMessageHandler,
  updateRankingClients
} from '../helpers';
import type { WsRankingsClient } from '../types';
import { RankingsService } from '../services/RankingsService';

interface GameWrapper {
  game: GameController;
  room: Room;
}

export const handleGames = (
  message: WsMessageHandler<WsRankingsClient>,
  roomsManager: RoomManager,
  gameType: GameType,
  gameControllerFactory: GameControllerFactory
) => {
  const games: GameWrapper[] = [];

  const getGameWrapperByPlayerClient = (
    client: WsRankingsClient
  ): { gameWrapper: GameWrapper; playerIndex: number } | null => {
    let playerIndex = -1;
    const gameWrapper = games.find(({ room }) => {
      playerIndex = room.players.findIndex((player) => player?.client === client);
      if (playerIndex === -1) return false;

      return true;
    });

    return playerIndex !== -1 && gameWrapper !== undefined ? { gameWrapper, playerIndex } : null;
  };

  const gameFactory = (room: Room): GameWrapper => {
    const game = gameControllerFactory();

    return { game, room };
  };

  roomsManager.onRoomStart((room) => {
    const game = gameFactory(room);

    games.push(game);
  });

  message('move', async (client, moveData) => {
    const gameWrapperData = getGameWrapperByPlayerClient(client);
    if (!gameWrapperData) return;

    const {
      gameWrapper: { game, room },
      playerIndex
    } = gameWrapperData;

    if (game.winnerIndex !== null) return;

    if (playerIndex !== game.nextPlayerIndex) return;

    const moveSucceeded = game.move(moveData);

    if (!moveSucceeded) return;

    sendToAllClients(
      room.playersInRoom.filter((cl) => cl !== client),
      'move',
      moveData
    );

    if (game.winnerIndex !== null) {
      const winner = room.players[game.winnerIndex];
      const loser = room.players[game.winnerIndex === 0 ? 1 : 0];

      if (!winner || !loser) {
        return;
      }

      await RankingsService.updateRankings(
        winner.client.player.id,
        loser.client.player.id,
        gameType
      );

      await updateRankingClients([winner.client, loser.client]);

      roomsManager.end(client, game.winnerIndex);
    }
  });
};
