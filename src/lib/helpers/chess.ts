import { Point } from '$lib/classes';
import {
	PieceColor,
	PieceType,
	type ChessBoard,
	type Piece,
	type PieceConstructor,
	type ChessBoardItem
} from '$lib/types';

export const getPiecesFromFenString = (fenString: string): ChessBoard => {
	let row: ChessBoardItem[] = [];
	const board: ChessBoard = [row];

	for (const letter of fenString) {
		if (Object.values(PieceType).includes(letter.toLowerCase() as PieceType)) {
			const color = /[A-Z]/.test(letter) ? PieceColor.WHITE : PieceColor.BLACK;

			row.push({
				piece: pieceFactory({
					type: letter.toLowerCase() as PieceType,
					color
				})
			});
		} else if (letter === '/') {
			row = [];
			board.push(row);
			continue;
		} else if (letter === ' ') {
			break;
		} else if (!isNaN(parseInt(letter))) {
			row.push(
				...Array(parseInt(letter))
					.fill(0)
					.map(() => ({}))
			);
		}
	}

	return board.reverse();
};

const findPieceCoordinates = (piece: Piece, chessBoard: ChessBoard): Point | null => {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (chessBoard[y][x]?.piece === piece) return new Point(x, y);
		}
	}

	return null;
};

const getPieceFactory = (chessBoard: ChessBoard) => (point: Point) =>
	chessBoard.at(point.y)?.at(point.x)?.piece;

const pieceFactory = (data: PieceConstructor): Piece => {
	const canMoveTo = (newX: number, newY: number, piece: Piece, chessBoard: ChessBoard): boolean => {
		const canMove = availableMoves(piece, chessBoard).find(({ x, y }) => x === newX && y === newY);

		return !!canMove;
	};

	const isWhite = () => data.color === PieceColor.WHITE;
	const isBlack = () => data.color === PieceColor.BLACK;

	const availableMoves = (piece: Piece, chessBoard: ChessBoard): Point[] => {
		const oppositeColor = isWhite() ? PieceColor.BLACK : PieceColor.WHITE;
		const sameColor = isWhite() ? PieceColor.WHITE : PieceColor.BLACK;

		const getPiece = getPieceFactory(chessBoard);

		const moves: Point[] = [];

		const currentPos = findPieceCoordinates(piece, chessBoard);
		if (!currentPos) return [];

		switch (data.type) {
			case PieceType.PAWN: {
				const diagonalPoints = isWhite()
					? [currentPos.add(-1, 1), currentPos.add(1, 1)]
					: [currentPos.add(-1, -1), currentPos.add(1, -1)];

				for (const diagonalPoint of diagonalPoints) {
					if (getPiece(diagonalPoint)?.color === oppositeColor) moves.push(diagonalPoint);
				}

				const pointDoubleAhead = isWhite() ? currentPos.add(0, 2) : currentPos.add(0, -2);
				const pointAhead = isWhite() ? currentPos.add(0, 1) : currentPos.add(0, -1);

				const pieceDoubleAhead = getPiece(pointDoubleAhead);
				const pieceAhead = getPiece(pointAhead);

				if (isWhite() && currentPos.yEq(1) && !pieceAhead && !pieceDoubleAhead)
					moves.push(currentPos.addY(2));

				if (isBlack() && currentPos.yEq(6) && !pieceAhead && !pieceDoubleAhead)
					moves.push(currentPos.addY(-2));

				if (isWhite() && !pieceAhead) moves.push(currentPos.addY(1));

				if (isBlack() && !pieceAhead) moves.push(currentPos.addY(-1));

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
					const blockingPiecePos = currentPos.add(x, y);
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
					let { x, y } = currentPos.add(rookMove.incrementX, rookMove.incrementY);

					while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
						const point = new Point(x, y);
						const piece = getPiece(point);

						console.log(point, piece);

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
					let { x, y } = currentPos.add(bishopMove.incrementX, bishopMove.incrementY);

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

						let { x, y } = currentPos.add(incrementX, incrementY);

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

						const point = currentPos.add(x, y);
						const piece = getPiece(point);

						if (piece) {
							if (piece.color === oppositeColor) moves.push(point);
							continue;
						}

						moves.push(point);
					}
				}
				break;
			}
		}

		return moves.filter(({ x, y }) => x <= 7 && x >= 0 && y <= 7 && y >= 0);
	};

	return { ...data, canMoveTo, availableMoves };
};
