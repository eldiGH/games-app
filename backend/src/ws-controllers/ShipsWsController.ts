import { messageFactory, wsController, type Room } from '../helpers';
import { handleRooms } from '../wsHandlers';
import { shipsGameControllerFactory, type ShipsGameController } from '@shared/gameControllers';
import type { WsClient } from '../types';
import { Point } from '@shared/classes';
import { ShotOutcome } from '@shared/types';

interface ShipsPlayer {
  controller: ShipsGameController;
  sentLayout: boolean;
}

interface ShipsGame {
  players: [ShipsPlayer, ShipsPlayer];
  room: Room;
}

const games: ShipsGame[] = [];

const oppositePlayerIndex = (playerIndex: number) => (playerIndex === 0 ? 1 : 0);

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
      points: points.map((coordinates) => new Point(coordinates)),
      timesShot: 0,
      sunk: false
    }))
  );

  player.sentLayout = true;

  const otherPlayer = shipsGame.players[oppositePlayerIndex(playerIndex)];

  if (!otherPlayer.sentLayout) return;

  const firstWsClient = gameData.shipsGame.room.players[0]?.client;

  if (!firstWsClient) return;

  firstWsClient.send('start', undefined);
  gameData.shipsGame.players[0].controller.setMyTurn(true);
});

message('shoot', (client, coords) => {
  const gameData = getShipsGameByPlayerClient(client);

  if (!gameData) return;

  const {
    playerIndex,
    shipsGame: { players, room }
  } = gameData;

  const myController = players[playerIndex].controller;
  const opponentController = players[oppositePlayerIndex(playerIndex)].controller;
  const opponentClient = room.players[oppositePlayerIndex(playerIndex)]?.client;
  if (!opponentClient) return;

  if (!myController.isMyTurn) return;

  const point = new Point(coords);

  const outcome = opponentController.shootMe(point);
  if (outcome === ShotOutcome.Error) return;
  if (!myController.shoot(point, () => outcome)) return;

  client.send('shot', outcome);
  opponentClient.send('shoot', coords);

  const loserIndex = players.findIndex((p) => p.controller.lost);
  if (loserIndex === -1) {
    return;
  }

  const winnerIndex = oppositePlayerIndex(loserIndex);
  games.splice(games.indexOf(gameData.shipsGame));
  roomsManager.end(client, winnerIndex);
});
