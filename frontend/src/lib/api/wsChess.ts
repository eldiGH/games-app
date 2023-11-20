import { roomsExtendedClient, type RoomsWsConnect } from '$lib/helpers';
import { wsControllerFactory } from './wsClient';
import { chessControllerFactory, type ChessGameController } from '@shared/gameControllers';
import type { BoardData, BoardItem } from '$lib/components/Board/Board.svelte';
import type { Point } from '@shared/classes';
import { getWsChessBoardClientFactory } from './wsChessBoard';

const calculateBoardData = (
  controller: ChessGameController,
  isMyTurn: boolean,
  markedFields?: Point[]
): BoardData => {
  const boardData: BoardData = [];

  let currentPieceIndex = 0;
  let currentMarkedFieldIndex = 0;

  const { pieces } = controller;

  for (let y = 0; y < 8; y++) {
    const rank: BoardItem[] = [];

    for (let x = 0; x < 8; x++) {
      const cell: BoardItem = {};

      if (pieces.at(currentPieceIndex)?.position.eq(x, y)) {
        const piece = pieces[currentPieceIndex];
        currentPieceIndex++;
        cell.imgUrl = `/svg/chess/${piece.color}_${piece.type}.svg`;
        cell.draggable = isMyTurn;
      }

      if (markedFields && markedFields.at(currentMarkedFieldIndex)?.eq(x, y)) {
        currentMarkedFieldIndex++;
        cell.marked = true;
      }

      rank.push(cell);
    }

    boardData.push(rank);
  }

  return boardData;
};

const onStartDrag = (controller: ChessGameController, position: Point): Point[] => {
  const piece = controller.getPiece(position);
  if (!piece) return [];

  return [...piece.possibleMoves];
};

const wsChessClientFactory = getWsChessBoardClientFactory(chessControllerFactory, {
  calculateBoardData,
  onStartDrag
});

export const wsChessClient = wsChessClientFactory(
  roomsExtendedClient(wsControllerFactory('chess'))
);

export type WsChessClient = Awaited<ReturnType<typeof wsChessClient>>;
