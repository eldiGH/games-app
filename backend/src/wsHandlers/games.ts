import type { GameType } from '@prisma/client';
import {
  RoomStatus,
  type GameController,
  type GameControllerFactory,
  type MoveData
} from '@shared/types';
import { sendToAllClients, type Room, type RoomManager, type WsMessageHandler } from '../helpers';
import type { WsClient } from '../types';

interface GameWrapper {
  game: GameController;
  room: Room;
}

export const handleGames = (
  message: WsMessageHandler,
  roomsManager: RoomManager,
  gameId: GameType,
  gameControllerFactory: GameControllerFactory
) => {
  const games: GameWrapper[] = [];

  const getGameWrapperByPlayerClient = (
    client: WsClient
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

  message('move', (client: WsClient, moveData: MoveData) => {
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
      room.status = RoomStatus.Full;
      room.sendRoomData();
    }
  });
};
