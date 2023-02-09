import type { Point } from '$lib/classes';

export enum StoneColor {
	WHITE = 'w',
	RED = 'r'
}

export interface StoneMove {
	position: Point;
	attackedStone?: Stone;
}

export interface Stone {
	color: StoneColor;
	isDame: boolean;
	position: Point;
	possibleMoves: StoneMove[];
}
