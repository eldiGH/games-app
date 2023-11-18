import { messageFactory, wsController, type Room } from '../helpers';
import { handleRooms } from '../wsHandlers';
import { shipsGameControllerFactory, type ShipsGameController } from '@shared/gameControllers';
import type { WsClient } from '../types';
import { Point } from '@shared/classes';

interface ShipsPlayer {
  controller: ShipsGameController;
  sentLayout: boolean;
}

interface ShipsGame {
  players: [ShipsPlayer, ShipsPlayer];
  room: Room;
}

const games: ShipsGame[] = [];

const getShipsGameByPlayerClient = (
  client: WsClient
): { shipsGame: ShipsGame; playerIndex: number } | null => {
  let playerIndex = -1;
  const shipsGame = games.find(({ room }) => {
    playerIndex = room.players.findIndex((player) => player?.client === client);
    if (playerIndex === -1) return false;

    return true;
  });

  return playerIndex !== -1 && shipsGame !== undefined ? { shipsGame, playerIndex } : null;
};

export const ShipsWsController = wsController('/ships');
const message = messageFactory(ShipsWsController);

const roomsManager = handleRooms(message);

roomsManager.onRoomStart((room) => {
  const player1: ShipsPlayer = { controller: shipsGameControllerFactory(), sentLayout: false };
  const player2: ShipsPlayer = { controller: shipsGameControllerFactory(), sentLayout: false };

  games.push({ players: [player1, player2], room });
});

message('shipLayout', (client, layout) => {
  const gameData = getShipsGameByPlayerClient(client);

  if (!gameData) return;

  const { playerIndex, shipsGame } = gameData;

  const player = shipsGame.players[playerIndex];

  player.controller.setShips(
    layout.map(({ type, points }) => ({
      type,
      points: points.map((coordinates) => new Point(coordinates))
    }))
  );

  player.sentLayout = true;

  const otherPlayer = shipsGame.players[playerIndex === 0 ? 1 : 0];

  if (!otherPlayer.sentLayout) return;

  const firstWsClient = gameData.shipsGame.room.players[0]?.client;

  if (!firstWsClient) return;

  firstWsClient.send('start', undefined);
});

message('shoot', (coords) => {});
