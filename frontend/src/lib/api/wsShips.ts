import { roomsExtendedClient, type RoomsWsConnect } from '$lib/helpers';
import type { WsClientFactory } from '$lib/types';
import { wsControllerFactory } from './wsClient';
import { writable, type Readable } from 'svelte/store';
import { Point } from '@shared/classes';
import { shipsGameControllerFactory } from '@shared/gameControllers';
import type { ShipsBoard, ShipsBoardDataItem } from '$lib/types/Ships';
import type { Ship } from '@shared/types';

export interface WsShipsClientMethods {
  shoot: (point: Point) => Promise<boolean>;
  randomizeShipPlacement: () => void;
  myBoard: Readable<ShipsBoard>;
  enemyBoard: Readable<ShipsBoard>;
  isMyTurn: Readable<boolean>;
  hasShips: Readable<boolean>;
  winnerIndex: Readable<number | null>;
}

const COLS_AND_ROWS_COUNT = 10;

const getEmptyBoardData = (): ShipsBoard => {
  const board: ShipsBoard = [];

  for (let row = 0; row < COLS_AND_ROWS_COUNT; row++) {
    const rowData: ShipsBoardDataItem[] = [];
    board.push(rowData);

    for (let col = 0; col < COLS_AND_ROWS_COUNT; col++) {
      rowData.push({ hasShip: false, hasMiss: false, hasShot: false });
    }
  }

  return board;
};

const clearBoard = (board: ShipsBoard, keys: (keyof ShipsBoardDataItem)[]) => {
  for (let row = 0; row < COLS_AND_ROWS_COUNT; row++) {
    for (let col = 0; col < COLS_AND_ROWS_COUNT; col++) {
      for (const key of keys) {
        board[row][col][key] = false;
      }
    }
  }
};

const updateBoardShips = (board: ShipsBoard, ships: Ship[]) => {
  clearBoard(board, ['hasShip']);

  for (const ship of ships) {
    for (const point of ship.points) {
      board[point.y][point.x].hasShip = true;
    }
  }
};

const updateBoardMisses = (board: ShipsBoard, misses: Point[]) => {
  clearBoard(board, ['hasMiss']);

  for (const miss of misses) {
    board[miss.y][miss.x].hasMiss = true;
  }
};

const updateBoardShots = (board: ShipsBoard, shots: Point[]) => {
  clearBoard(board, ['hasShot']);

  for (const shot of shots) {
    board[shot.y][shot.x].hasShot = true;
  }
};

const wsShipsClientFactory: WsClientFactory<WsShipsClientMethods, RoomsWsConnect> = (wsClient) => {
  const connect = async () => {
    const client = await wsClient();
    const { addMessageListener } = client;

    const controller = shipsGameControllerFactory();

    const myBoard = writable<ShipsBoard>(getEmptyBoardData());
    const enemyBoard = writable<ShipsBoard>(getEmptyBoardData());
    const hasShips = writable(false);
    const winnerIndex = writable<number | null>(null);

    const isMyTurn = writable(false);

    controller.setTurnUpdateListener((turn) => {
      isMyTurn.set(turn);
    });

    client.onRoomStart(() => {
      winnerIndex.set(null);

      client.send(
        'shipLayout',
        controller.ships.map(({ type, points }) => ({
          type,
          points: points.map((point) => point.toCoordinates())
        }))
      );

      controller.resetGameState();
      enemyBoard.update((enemyBoard) => {
        updateBoardMisses(enemyBoard, controller.missesOnEnemy);
        updateBoardShots(enemyBoard, controller.shotsOnEnemy);

        return [...enemyBoard];
      });

      myBoard.update((board) => {
        updateBoardMisses(board, controller.shotsOnMe);

        return [...board];
      });
    });

    addMessageListener('shoot', (coords) => {
      controller.shootMe(new Point(coords));

      myBoard.update((board) => {
        updateBoardMisses(board, controller.shotsOnMe);

        return [...board];
      });
    });

    addMessageListener('start', () => {
      controller.setMyTurn(true);
    });

    addMessageListener('end', (data) => {
      winnerIndex.set(data.winnerIndex);
    });

    const additionalMethods = {
      shoot: async (point: Point) => {
        if (!point.within(0, 0, 10, 10)) return false;

        if (
          !(await controller.shoot(point, () => {
            client.send('shoot', point);
            return client.waitForMessage('shot');
          }))
        ) {
          return false;
        }

        enemyBoard.update((enemyBoard) => {
          updateBoardMisses(enemyBoard, controller.missesOnEnemy);
          updateBoardShots(enemyBoard, controller.shotsOnEnemy);

          return [...enemyBoard];
        });

        return true;
      },

      sit: (...args: Parameters<typeof client.sit>) => {
        controller.setShips([]);

        hasShips.set(false);

        myBoard.update((board) => {
          updateBoardShips(board, controller.ships);

          return [...board];
        });

        return client.sit(...args);
      },

      kick: (...args: Parameters<typeof client.kick>) => {
        controller.setShips([]);

        hasShips.set(false);

        myBoard.update((board) => {
          updateBoardShips(board, controller.ships);

          return [...board];
        });

        return client.kick(...args);
      },

      randomizeShipPlacement: () => {
        controller.randomizePlacement();

        hasShips.set(true);

        myBoard.update((board) => {
          updateBoardShips(board, controller.ships);
          updateBoardMisses(board, controller.shotsOnMe);

          return [...board];
        });
      }
    };

    return {
      ...client,
      ...additionalMethods,
      myBoard: { subscribe: myBoard.subscribe },
      enemyBoard: { subscribe: enemyBoard.subscribe },
      isMyTurn: { subscribe: isMyTurn.subscribe },
      hasShips: { subscribe: hasShips.subscribe },
      winnerIndex: { subscribe: winnerIndex.subscribe }
    };
  };

  return connect;
};

export const wsShipsClient = wsShipsClientFactory(
  roomsExtendedClient(wsControllerFactory('ships'))
);

export type WsShipsClient = Awaited<ReturnType<typeof wsShipsClient>>;
