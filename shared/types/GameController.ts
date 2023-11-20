import type { MoveData } from './MoveData';

export interface GameController {
  readonly nextPlayerIndex: number;
  readonly winnerIndex: number | null;
  move: (moveData: MoveData) => boolean;
}

export type GameControllerFactory<
  T extends GameController = GameController,
  A extends unknown[] = []
> = (...args: A) => T;
