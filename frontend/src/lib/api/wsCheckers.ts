import { roomsExtendedClient } from '$lib/helpers';
import type { WsClientFactory } from '$lib/types';
import type { MoveData } from '@shared/types';
import { wsControllerFactory } from './wsClient';
import { checkersControllerFactory } from '@shared/gameControllers';
import type { BoardData, BoardItem } from '$lib/components/Board/Board.svelte';
import { writable, type Readable } from 'svelte/store';
import type { Point } from '@shared/classes';

export interface WsCheckersClientMethods {
  readonly boardData: Readable<BoardData>;
  move: (moveData: MoveData) => boolean;
  startDrag: (position: Point) => void;
  stopDrag: () => void;
}

roomsExtendedClient(wsControllerFactory('checkers'));

export const wsCheckersClientFactory: WsClientFactory<WsCheckersClientMethods> = (wsClient) => {
  const connect = async () => {
    const game = checkersControllerFactory();

    const boardDataStore = writable<BoardData>([]);

    const calculateBoardData = (markedFields?: Point[]) => {
      let currentStonesIndex = 0;
      let currentMarkedFieldsIndex = 0;
      const boardData: BoardData = [];

      const { stones } = game;

      for (let y = 0; y <= 7; y++) {
        const rank: BoardItem[] = [];
        boardData.push(rank);

        for (let x = 0; x <= 7; x++) {
          const item: BoardItem = {};

          if (stones.at(currentStonesIndex)?.position.eq(x, y)) {
            const stone = stones[currentStonesIndex];

            item.imgUrl = `/svg/checkers/${stone.color}_${stone.isDame ? 'dame' : 'stone'}.svg`;
            item.draggable = stone.color === game.turn && !!stone.possibleMoves.length;

            currentStonesIndex++;
          }

          if (markedFields && markedFields.at(currentMarkedFieldsIndex)?.eq(x, y)) {
            item.marked = true;

            currentMarkedFieldsIndex++;
          }

          rank.push(item);
        }
      }

      boardDataStore.set(boardData);
    };

    const startDrag = (position: Point) => {
      const stone = game.getStone(position);
      if (!stone) return;

      const markedFields = stone.possibleMoves.map(({ position }) => position);

      calculateBoardData(markedFields);
    };

    const stopDrag = () => {
      calculateBoardData();
    };

    const client = await wsClient();
    const { addMessageListener } = client;

    const handleMove = (moveData: MoveData): boolean => {
      const moveSucceeded = game.move(moveData);
      if (!moveSucceeded) return false;

      calculateBoardData();
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

    calculateBoardData();
    return {
      ...client,
      move,
      boardData: { subscribe: boardDataStore.subscribe },
      startDrag,
      stopDrag
    };
  };

  return connect;
};

export const wsCheckersClient = wsCheckersClientFactory(
  roomsExtendedClient(wsControllerFactory('checkers'))
);

export type WsCheckersClient = Awaited<ReturnType<typeof wsCheckersClient>>;
