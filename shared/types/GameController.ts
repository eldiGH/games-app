import type { MoveData } from './MoveData';

export interface GameController {
  readonly nextPlayerIndex: number;
  move: (moveData: MoveData) => boolean;
}

export type GameControllerFactory<T extends GameController = GameController> = () => T;
