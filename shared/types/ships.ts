import type { Point } from '@shared/classes';

export enum ShipType {
  Carrier,
  Battleship,
  Submarine,
  Destroyer
}

export interface Ship {
  type: ShipType;
  points: Point[];
}

export interface ShipTemplate {
  count: number;
  size: number;
  type: ShipType;
}
