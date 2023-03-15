import type { GameType } from '@prisma/client';
import type { GameController, GameControllerFactory } from '@shared/types';
import type { Room, RoomManager, WsMessageHandler } from '../helpers';
import type { WsClient } from '../types';

interface Game {
  game: GameController;
  room: Room;
}

export const handleGames = (
  message: WsMessageHandler,
  roomsManager: RoomManager,
  gameId: GameType,
  gameControllerFactory: GameControllerFactory
) => {
  const games: Game[] = [];

  const gameFactory = (room: Room): Game => {
    const game = gameControllerFactory();

    return { game, room };
  };

  roomsManager.onRoomStart((room) => {
    const game = gameFactory(room);

    games.push(game);
  });

  const move = (client: WsClient) => {
    ///
  };
};
