import type { Point } from '@shared/classes';

export enum PieceType {
	ROOK = 'r',
	QUEEN = 'q',
	KING = 'k',
	PAWN = 'p',
	BISHOP = 'b',
	KNIGHT = 'n'
}

export enum PieceColor {
	WHITE = 'w',
	BLACK = 'b'
}

export interface Piece {
	type: PieceType;
	color: PieceColor;
	position: Point;
	possibleMoves: Point[];
}

export type ChessSquare = Piece | null;

export interface Castle {
	queenSide: boolean;
	kingSide: boolean;
}
