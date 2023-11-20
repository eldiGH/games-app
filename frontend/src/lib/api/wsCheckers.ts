import { roomsExtendedClient } from '$lib/helpers';
import { wsControllerFactory } from './wsClient';
import { checkersControllerFactory, type CheckersGameController } from '@shared/gameControllers';
import type { BoardData, BoardItem } from '$lib/components/Board/Board.svelte';
import { getWsChessBoardClientFactory } from './wsChessBoard';
import type { Point } from '@shared/classes';

const calculateBoardData = (
  controller: CheckersGameController,
  isMyTurn: boolean,
  markedFields?: Point[]
): BoardData => {
  let currentStonesIndex = 0;
  let currentMarkedFieldsIndex = 0;
  const boardData: BoardData = [];

  const { stones } = controller;

  for (let y = 0; y <= 7; y++) {
    const rank: BoardItem[] = [];
    boardData.push(rank);

    for (let x = 0; x <= 7; x++) {
      const item: BoardItem = {};

      if (stones.at(currentStonesIndex)?.position.eq(x, y)) {
        const stone = stones[currentStonesIndex];

        item.imgUrl = `/svg/checkers/${stone.color}_${stone.isDame ? 'dame' : 'stone'}.svg`;
        item.draggable = isMyTurn && !!stone.possibleMoves.length;

        currentStonesIndex++;
      }

      if (markedFields && markedFields.at(currentMarkedFieldsIndex)?.eq(x, y)) {
        item.marked = true;

        currentMarkedFieldsIndex++;
      }

      rank.push(item);
    }
  }

  return boardData;
};

const onStartDrag = (controller: CheckersGameController, position: Point): Point[] => {
  const stone = controller.getStone(position);
  if (!stone) return [];

  return stone.possibleMoves.map(({ position }) => position);
};

const wsCheckersClientFactory = getWsChessBoardClientFactory(checkersControllerFactory, {
  calculateBoardData,
  onStartDrag
});

export const wsCheckersClient = wsCheckersClientFactory(
  roomsExtendedClient(wsControllerFactory('checkers'))
);

export type WsCheckersClient = Awaited<ReturnType<typeof wsCheckersClient>>;
