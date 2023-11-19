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
  timesShot: number;
  sunk: boolean;
}

export interface ShipDto {
  type: ShipType;
  points: Coordinates[];
}

export interface ShipTemplate {
  count: number;
  size: number;
}

export enum ShotOutcome {
  Miss,
  Hit,
  Sunk,
  Error
}
