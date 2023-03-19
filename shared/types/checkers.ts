import type { Point } from '@shared/classes';

export enum StoneColor {
  WHITE = 'w',
  RED = 'r'
}

export enum CheckersPlayerIndex {
  BOTH = -1,
  WHITE = 0,
  RED = 1
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
