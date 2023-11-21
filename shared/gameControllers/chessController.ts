import { Point } from '@shared/classes';
import {
  PieceColor,
  type Castle,
  PieceType,
  type Piece,
  type GameControllerFactory,
  type GameController,
  type MoveData
} from '@shared/types';

export interface ChessGameController extends GameController {
  pieces: readonly Piece[];
  setState: (
    pieces: Piece[],
    whiteCastle: Castle,
    blackCastle: Castle,
    turn: PieceColor,
    enPassant: Point | undefined
  ) => void;
  forceMove: (from: Point, to: Point) => void;
  availableMoves: (piece: Piece) => Point[];
  getPiece: (position: Point) => Piece | undefined;
}

const getDefaultPieces = (): Piece[] => {
  return [
    {
      type: PieceType.ROOK,
      color: PieceColor.WHITE,
      position: new Point({
        x: 0,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KNIGHT,
      color: PieceColor.WHITE,
      position: new Point({
        x: 1,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.BISHOP,
      color: PieceColor.WHITE,
      position: new Point({
        x: 2,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.QUEEN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 3,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KING,
      color: PieceColor.WHITE,
      position: new Point({
        x: 4,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.BISHOP,
      color: PieceColor.WHITE,
      position: new Point({
        x: 5,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KNIGHT,
      color: PieceColor.WHITE,
      position: new Point({
        x: 6,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.ROOK,
      color: PieceColor.WHITE,
      position: new Point({
        x: 7,
        y: 0
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 0,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 1,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 2,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 3,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 4,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 5,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 6,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      position: new Point({
        x: 7,
        y: 1
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 0,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 1,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 2,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 3,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 4,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 5,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 6,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 7,
        y: 6
      }),
      possibleMoves: []
    },
    {
      type: PieceType.ROOK,
      color: PieceColor.BLACK,
      position: new Point({
        x: 0,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KNIGHT,
      color: PieceColor.BLACK,
      position: new Point({
        x: 1,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.BISHOP,
      color: PieceColor.BLACK,
      position: new Point({
        x: 2,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.QUEEN,
      color: PieceColor.BLACK,
      position: new Point({
        x: 3,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KING,
      color: PieceColor.BLACK,
      position: new Point({
        x: 4,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.BISHOP,
      color: PieceColor.BLACK,
      position: new Point({
        x: 5,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.KNIGHT,
      color: PieceColor.BLACK,
      position: new Point({
        x: 6,
        y: 7
      }),
      possibleMoves: []
    },
    {
      type: PieceType.ROOK,
      color: PieceColor.BLACK,
      position: new Point({
        x: 7,
        y: 7
      }),
      possibleMoves: []
    }
  ];
};

export const chessControllerFactory: GameControllerFactory<ChessGameController, [boolean] | []> = (
  calculateMoves = true
) => {
  let _pieces: Piece[] = getDefaultPieces();
  let _whiteCastle: Castle = { kingSide: false, queenSide: false };
  let _blackCastle: Castle = { kingSide: false, queenSide: false };
  let _turn: PieceColor = PieceColor.WHITE;
  let _enPassant: Point | undefined = undefined;

  let _winnerIndex: number | null = null;

  const getPiece = (position: Point): Piece | undefined => {
    return _pieces.find((piece) => position.eq(piece.position));
  };

  const availableMoves = (piece: Piece): Point[] => {
    const isWhite = piece.color === PieceColor.WHITE;

    const oppositeColor = isWhite ? PieceColor.BLACK : PieceColor.WHITE;
    const sameColor = isWhite ? PieceColor.WHITE : PieceColor.BLACK;

    const moves: Point[] = [];

    switch (piece.type) {
      case PieceType.PAWN: {
        const diagonalPoints = isWhite
          ? [piece.position.add(-1, 1), piece.position.add(1, 1)]
          : [piece.position.add(-1, -1), piece.position.add(1, -1)];

        for (const diagonalPoint of diagonalPoints) {
          if (
            getPiece(diagonalPoint)?.color === oppositeColor ||
            (_enPassant && diagonalPoint.eq(_enPassant))
          )
            moves.push(diagonalPoint);
        }

        const pointDoubleAhead = isWhite ? piece.position.add(0, 2) : piece.position.add(0, -2);
        const pointAhead = isWhite ? piece.position.add(0, 1) : piece.position.add(0, -1);

        const pieceDoubleAhead = getPiece(pointDoubleAhead);
        const pieceAhead = getPiece(pointAhead);

        if (isWhite && piece.position.yEq(1) && !pieceAhead && !pieceDoubleAhead)
          moves.push(piece.position.addY(2));

        if (!isWhite && piece.position.yEq(6) && !pieceAhead && !pieceDoubleAhead)
          moves.push(piece.position.addY(-2));

        if (isWhite && !pieceAhead) moves.push(piece.position.addY(1));

        if (!isWhite && !pieceAhead) moves.push(piece.position.addY(-1));

        break;
      }

      case PieceType.KNIGHT: {
        const knightRelativeMoves = [
          [-1, 2],
          [1, 2],
          [2, 1],
          [2, -1],
          [1, -2],
          [-1, -2],
          [-2, -1],
          [-2, 1]
        ];

        for (const [x, y] of knightRelativeMoves) {
          const blockingPiecePos = piece.position.add(x, y);
          const blockingPiece = getPiece(blockingPiecePos);

          if (!(blockingPiece?.color === sameColor)) moves.push(blockingPiecePos);
        }

        break;
      }

      case PieceType.ROOK: {
        const rookMoves = [
          { incrementX: 0, incrementY: 1 },
          { incrementX: 1, incrementY: 0 },
          { incrementX: 0, incrementY: -1 },
          { incrementX: -1, incrementY: 0 }
        ];

        for (const rookMove of rookMoves) {
          let { x, y } = piece.position.add(rookMove.incrementX, rookMove.incrementY);

          while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            const point = new Point(x, y);
            const piece = getPiece(point);

            if (piece) {
              if (piece.color === oppositeColor) moves.push(point);
              break;
            }

            moves.push(point);

            x += rookMove.incrementX;
            y += rookMove.incrementY;
          }
        }

        break;
      }

      case PieceType.BISHOP: {
        const bishopMoves = [
          { incrementX: 1, incrementY: 1 },
          { incrementX: 1, incrementY: -1 },
          { incrementX: -1, incrementY: -1 },
          { incrementX: -1, incrementY: 1 }
        ];

        for (const bishopMove of bishopMoves) {
          let { x, y } = piece.position.add(bishopMove.incrementX, bishopMove.incrementY);

          while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            const point = new Point(x, y);
            const piece = getPiece(point);

            if (piece) {
              if (piece.color === oppositeColor) moves.push(point);
              break;
            }

            moves.push(point);

            x += bishopMove.incrementX;
            y += bishopMove.incrementY;
          }
        }
        break;
      }

      case PieceType.QUEEN: {
        for (let incrementY = -1; incrementY < 2; incrementY++) {
          for (let incrementX = -1; incrementX < 2; incrementX++) {
            if (incrementX === 0 && incrementY === 0) continue;

            let { x, y } = piece.position.add(incrementX, incrementY);

            while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
              const point = new Point(x, y);
              const piece = getPiece(point);

              if (piece) {
                if (piece.color === oppositeColor) moves.push(point);
                break;
              }

              moves.push(point);

              x += incrementX;
              y += incrementY;
            }
          }
        }
        break;
      }

      case PieceType.KING: {
        for (let y = -1; y < 2; y++) {
          for (let x = -1; x < 2; x++) {
            if (x === 0 && y === 0) continue;

            const point = piece.position.add(x, y);

            const nearbyPiece = getPiece(point);

            if (nearbyPiece) {
              if (nearbyPiece.color === oppositeColor) moves.push(point);
              continue;
            }

            moves.push(point);
          }
        }
        break;
      }
    }

    const filteredMoves = moves.filter(({ x, y }) => x <= 7 && x >= 0 && y <= 7 && y >= 0);

    return filteredMoves;
  };

  const possibleMoves = (piece: Piece) => {
    const oppositeColor = piece.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    const calculatedAvailableMoves = availableMoves(piece);

    let myKingPosition =
      piece.type === PieceType.KING ? piece.position : findKingPosition(piece.color)?.position;

    if (!myKingPosition) return calculatedAvailableMoves;

    const finalMoves: Point[] = [];

    for (const move of calculatedAvailableMoves) {
      const nextTurn = copyGame();
      nextTurn.forceMove(piece.position, move);

      if (piece.type === PieceType.KING) {
        myKingPosition = move;
      }

      const enemyPieces: Piece[] = nextTurn.pieces.filter((piece) => piece.color === oppositeColor);
      const enemyMoves = enemyPieces.flatMap((piece) => nextTurn.availableMoves(piece));

      const legalMove = !enemyMoves.find((move) => move.eq(myKingPosition as Point));

      if (legalMove) finalMoves.push(move);
    }

    return finalMoves.sort(Point.comparator);
  };

  const canMoveTo = (piecePoint: Point, newPoint: Point): boolean => {
    const piece = getPiece(piecePoint);
    if (!piece) return false;

    const calculatedPossibleMoves = possibleMoves(piece);

    return !!calculatedPossibleMoves.find((point) => point.eq(newPoint));
  };

  const forceMove = (from: Point, to: Point) => {
    const piece = getPiece(from);
    if (!piece) return;

    const pieceToRemove = getPiece(to);
    if (pieceToRemove) _pieces = _pieces.filter((piece) => piece !== pieceToRemove);

    piece.position = to;

    _turn = _turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    if (piece.type === PieceType.PAWN) {
      if (_enPassant && _enPassant.eq(to)) {
        let pawnToRemove: Piece | undefined;
        if (piece.color === PieceColor.WHITE) pawnToRemove = getPiece(new Point(to.x, 4));
        else pawnToRemove = getPiece(new Point(to.x, 4));

        if (pawnToRemove) _pieces = _pieces.filter((piece) => piece !== pawnToRemove);
      }

      const multiplier = piece.color === PieceColor.WHITE ? 1 : -1;

      if (from.y + 2 * multiplier == to.y) _enPassant = from.add(0, 1 * multiplier);
      else _enPassant = undefined;
    } else {
      _enPassant = undefined;
    }

    if (piece.type === PieceType.KING) {
      if (from.x + 2 === to.x) {
        if (piece.color === PieceColor.WHITE) {
          const rook = getPiece(new Point(7, 0));
          if (rook) rook.position = new Point(5, 0);
        } else {
          const rook = getPiece(new Point(7, 7));
          if (rook) rook.position = new Point(5, 7);
        }
      } else if (from.x - 2 === to.x) {
        if (piece.color === PieceColor.WHITE) {
          const rook = getPiece(new Point(0, 0));
          if (rook) rook.position = new Point(3, 0);
        } else {
          const rook = getPiece(new Point(0, 7));
          if (rook) rook.position = new Point(3, 7);
        }
      }

      if (piece.color === PieceColor.WHITE) {
        _whiteCastle = { kingSide: false, queenSide: false };
      } else {
        _blackCastle = { kingSide: false, queenSide: false };
      }
    }

    if (piece.type === PieceType.ROOK) {
      if (from.eq(0, 0)) {
        _whiteCastle.queenSide = false;
      } else if (from.eq(7, 0)) {
        _whiteCastle.kingSide = false;
      } else if (from.eq(0, 7)) {
        _blackCastle.queenSide = false;
      } else if (from.eq(7, 7)) {
        _blackCastle.kingSide = false;
      }
    }

    sortPieces();
  };

  const move = (moveData: MoveData) => {
    const from = new Point(moveData.from);
    const to = new Point(moveData.to);

    const piece = getPiece(from);
    if (!piece || piece.color !== _turn || !canMoveTo(from, to)) return false;

    forceMove(from, to);
    calculateAllPossibleMoves();
    return true;
  };

  const copyGame = () => {
    const copy = chessControllerFactory(false);
    copy.setState(_pieces, _whiteCastle, _blackCastle, _turn, _enPassant);
    return copy;
  };

  const findKingPosition = (color: PieceColor): Piece | undefined => {
    return _pieces.find((piece) => piece.color === color && piece.type === PieceType.KING);
  };

  const sortPieces = () => {
    _pieces.sort((a, b) => Point.comparator(a.position, b.position));
  };

  const calculateAllPossibleMoves = () => {
    for (const piece of _pieces) {
      if (piece.color !== _turn) {
        piece.possibleMoves = [];
        continue;
      }

      piece.possibleMoves = possibleMoves(piece);
    }
  };

  const setState = (
    pieces: Piece[],
    whiteCastle: Castle,
    blackCastle: Castle,
    turn: PieceColor,
    enPassant: Point | undefined
  ) => {
    _blackCastle = { ...blackCastle };
    _whiteCastle = { ...whiteCastle };
    _turn = turn;
    _pieces = [...pieces.map((piece) => ({ ...piece, possibleMoves: [...piece.possibleMoves] }))];
    _enPassant = enPassant ? new Point(enPassant.x, enPassant.y) : undefined;

    sortPieces();
  };

  if (calculateMoves) {
    calculateAllPossibleMoves();
  }

  return {
    move,
    setState,
    forceMove,
    availableMoves,
    getPiece,
    get winnerIndex() {
      return _winnerIndex;
    },
    get nextPlayerIndex() {
      return _turn === PieceColor.WHITE ? 0 : 1;
    },
    get pieces() {
      return _pieces;
    }
  };
};
