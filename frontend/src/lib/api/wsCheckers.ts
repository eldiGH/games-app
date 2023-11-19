import { roomsExtendedClient, type RoomsWsConnect } from '$lib/helpers';
import type { WsClientFactory } from '$lib/types';
import type { MoveData } from '@shared/types';
import { wsControllerFactory } from './wsClient';
import { checkersControllerFactory, type CheckersGameController } from '@shared/gameControllers';
import type { BoardData, BoardItem } from '$lib/components/Board/Board.svelte';
import { get, writable, type Readable } from 'svelte/store';
import type { Point } from '@shared/classes';
import { playerStore } from '$lib/stores';

export interface WsCheckersClientMethods {
  readonly boardData: Readable<BoardData>;
  move: (moveData: MoveData) => boolean;
  startDrag: (position: Point) => void;
  stopDrag: () => void;
  winnerIndex: Readable<number | null>;
}

const wsCheckersClientFactory: WsClientFactory<WsCheckersClientMethods, RoomsWsConnect> = (
  wsClient
) => {
  const connect = async () => {
    const client = await wsClient();
    const { addMessageListener } = client;

    let myPlayerIndex = -1;

    client.onRoomStart(() => {
      game.set(checkersControllerFactory());

      const room = get(client.room);

      const myIndex =
        room?.players.findIndex(
          (player) => player && player.nickname === get(playerStore)?.nickname
        ) ?? -1;
      myPlayerIndex = myIndex;

      calculateBoardData();
    });

    const game = writable<CheckersGameController>(checkersControllerFactory());

    const boardDataStore = writable<BoardData>([]);
    const winnerIndex = writable<null | number>(null);

    const calculateBoardData = (markedFields?: Point[]) => {
      let currentStonesIndex = 0;
      let currentMarkedFieldsIndex = 0;
      const boardData: BoardData = [];

      const { stones, nextPlayerIndex } = get(game);

      for (let y = 0; y <= 7; y++) {
        const rank: BoardItem[] = [];
        boardData.push(rank);

        for (let x = 0; x <= 7; x++) {
          const item: BoardItem = {};

          if (stones.at(currentStonesIndex)?.position.eq(x, y)) {
            const stone = stones[currentStonesIndex];

            item.imgUrl = `/svg/checkers/${stone.color}_${stone.isDame ? 'dame' : 'stone'}.svg`;
            item.draggable = nextPlayerIndex === myPlayerIndex && !!stone.possibleMoves.length;

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
      const stone = get(game).getStone(position);
      if (!stone) return;

      const markedFields = stone.possibleMoves.map(({ position }) => position);

      calculateBoardData(markedFields);
    };

    const stopDrag = () => {
      calculateBoardData();
    };

    const handleMove = (moveData: MoveData): boolean => {
      const controller = get(game);

      const moveSucceeded = controller.move(moveData);
      if (!moveSucceeded) return false;

      calculateBoardData();

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

    calculateBoardData();

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

export const wsCheckersClient = wsCheckersClientFactory(
  roomsExtendedClient(wsControllerFactory('checkers'))
);

export type WsCheckersClient = Awaited<ReturnType<typeof wsCheckersClient>>;
