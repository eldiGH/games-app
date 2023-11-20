import type { WsClientFactory } from '$lib/types';
import type { GameController, GameControllerFactory, MoveData } from '@shared/types';
import type { BoardData } from '$lib/components/Board/Board.svelte';
import { get, writable, type Readable } from 'svelte/store';
import type { Point } from '@shared/classes';
import { playerStore } from '$lib/stores';
import type { RoomsWsConnect } from '$lib/helpers';

export interface WsChessBoardMethods {
  readonly boardData: Readable<BoardData>;
  move: (moveData: MoveData) => boolean;
  startDrag: (position: Point) => void;
  stopDrag: () => void;
  winnerIndex: Readable<number | null>;
}

export interface BoardDataMethods<T extends GameController> {
  calculateBoardData: (controller: T, isMyTurn: boolean, markedFields?: Point[]) => BoardData;
  onStartDrag: (controller: T, position: Point) => Point[];
}

export const getWsChessBoardClientFactory =
  <T extends GameController>(
    controllerFactory: GameControllerFactory<T>,
    boardDataMethods: BoardDataMethods<T>
  ): WsClientFactory<WsChessBoardMethods, RoomsWsConnect> =>
  (wsClient) => {
    const connect = async () => {
      const client = await wsClient();
      const { addMessageListener } = client;

      let myPlayerIndex = -1;

      let controller = controllerFactory();

      const boardDataStore = writable<BoardData>([]);
      const winnerIndex = writable<null | number>(null);

      const updateBoardData = (markedFields?: Point[]) => {
        boardDataStore.set(
          boardDataMethods.calculateBoardData(
            controller,
            myPlayerIndex === controller.nextPlayerIndex,
            markedFields
          )
        );
      };

      client.onRoomStart(() => {
        controller = controllerFactory();

        const room = get(client.room);

        const myIndex =
          room?.players.findIndex(
            (player) => player && player.nickname === get(playerStore)?.nickname
          ) ?? -1;
        myPlayerIndex = myIndex;

        updateBoardData();
      });

      const startDrag = (position: Point) => {
        const markedFields = boardDataMethods.onStartDrag(controller, position);

        updateBoardData(markedFields);
      };

      const stopDrag = () => {
        updateBoardData();
      };

      const handleMove = (moveData: MoveData): boolean => {
        const moveSucceeded = controller.move(moveData);
        if (!moveSucceeded) return false;

        updateBoardData();

        if (controller.winnerIndex !== null) {
          winnerIndex.set(controller.winnerIndex);
        }

        return true;
      };

      addMessageListener('move', (moveData) => {
        handleMove(moveData);
      });

      const move = (moveData: MoveData) => {
        const moveSucceeded = handleMove(moveData);

        if (!moveSucceeded) return false;
        client.send('move', moveData);

        return true;
      };

      updateBoardData();

      return {
        ...client,
        move,
        boardData: { subscribe: boardDataStore.subscribe },
        startDrag,
        stopDrag,
        winnerIndex
      };
    };

    return connect;
  };
