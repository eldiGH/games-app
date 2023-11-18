import type { Point } from '@shared/classes';
import type { Coordinates } from './Coordinates';

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

export interface ShipDto {
  type: ShipType;
  points: Coordinates[];
}

export interface ShipTemplate {
  count: number;
  size: number;
  type: ShipType;
}
