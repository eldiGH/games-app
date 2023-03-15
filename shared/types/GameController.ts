import type { Point } from '@shared/classes';

export interface GameController {
  move: (from: Point, to: Point) => boolean;
}

export type GameControllerFactory = () => GameController;
