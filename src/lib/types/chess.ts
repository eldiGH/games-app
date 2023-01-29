import type { Point } from '$lib/classes';

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

export interface PieceConstructor {
	type: PieceType;
	color: PieceColor;
}

export interface Piece extends PieceConstructor {
	canMoveTo: (x: number, y: number, piece: Piece, chessBoard: ChessBoard) => boolean;
	availableMoves: (piece: Piece, chessBoard: ChessBoard) => Point[];
}

export interface CellOptions {
	marked?: boolean;
}

export interface ChessBoardItem {
	piece?: Piece;
	cellOptions?: CellOptions;
}

export type ChessBoard = ChessBoardItem[][];
