import { Point } from '@shared/classes';
import {
  CheckersPlayerIndex,
  StoneColor,
  type GameController,
  type GameControllerFactory,
  type MoveData,
  type Stone,
  type StoneMove
} from '@shared/types';

export interface CheckersGameController extends GameController {
  getStone: (position: Point) => Stone | undefined;
  readonly stones: Stone[];
}

const getPlayerIndexFromColor = (color: StoneColor) =>
  color === StoneColor.WHITE ? CheckersPlayerIndex.WHITE : CheckersPlayerIndex.RED;

const getOppositeColor = (color: StoneColor) =>
  color === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;

export const getInitialStones = (): Stone[] => {
  const stones: Stone[] = [];

  for (let y = 0; y <= 2; y++) {
    for (let x = 1 - (y % 2); x <= 7; x += 2) {
      stones.push({
        position: new Point(x, y),
        color: StoneColor.WHITE,
        isDame: false,
        possibleMoves: []
      });
    }
  }

  for (let y = 5; y <= 7; y++) {
    for (let x = 1 - (y % 2); x <= 7; x += 2) {
      stones.push({
        position: new Point(x, y),
        color: StoneColor.RED,
        isDame: false,
        possibleMoves: []
      });
    }
  }

  return stones;
};

export const checkersControllerFactory: GameControllerFactory<CheckersGameController> = () => {
  let stones: Stone[] = getInitialStones();
  let turn = StoneColor.WHITE;
  let winnerIndex: CheckersPlayerIndex | null = null;
  let movesWithoutCapture = 0;

  const getStone = (position: Point) => {
    return stones.find((stone) => stone.position.eq(position));
  };

  const changeTurn = () => {
    turn = turn === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;
  };

  const availableMoves = (stone: Stone): StoneMove[] => {
    if (stone.color !== turn || winnerIndex !== null) return [];

    const availableMoves: StoneMove[] = [];
    const signMultiplier = stone.color === StoneColor.WHITE ? 1 : -1;
    const oppositeColor = getOppositeColor(turn);

    if (!stone.isDame) {
      for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
          const diagonalPoint = stone.position.add(x, y);
          const diagonalStone = getStone(diagonalPoint);

          if (!diagonalStone && y * signMultiplier > 0)
            availableMoves.push({ position: diagonalPoint });
          else if (diagonalStone?.color === oppositeColor) {
            const diagonalPointBehind = diagonalPoint.add(x, y);
            const diagonalStoneBehind = getStone(diagonalPointBehind);

            if (!diagonalStoneBehind)
              availableMoves.push({
                position: diagonalPointBehind,
                attackedStone: diagonalStone
              });
          }
        }
      }
    } else {
      for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
          let point = stone.position.add(x, y);

          while (point.within(0, 0, 7, 7)) {
            const stone = getStone(point);

            if (!stone) availableMoves.push({ position: point });
            else if (stone.color === oppositeColor) {
              point = point.add(x, y);
              while (point.within(0, 0, 7, 7)) {
                const stoneBehind = getStone(point);

                if (stoneBehind) break;
                availableMoves.push({ position: point, attackedStone: stone });
                point = point.add(x, y);
              }
              break;
            } else break;

            point = point.add(x, y);
          }
        }
      }
    }

    const legalMoves = availableMoves
      .filter((move) => move.position.within(0, 0, 7, 7))
      .sort((a, b) => Point.comparator(a.position, b.position));

    return legalMoves;
  };

  const calculateAllPossibleMoves = () => {
    if (winnerIndex !== null) return;

    for (const stone of stones) {
      stone.possibleMoves = availableMoves(stone);
    }

    const hasAnyAttack = stones.some(({ possibleMoves }) =>
      possibleMoves.some((move) => !!move.attackedStone)
    );

    if (!hasAnyAttack) return;

    for (const stone of stones) {
      stone.possibleMoves = stone.possibleMoves.filter(({ attackedStone }) => !!attackedStone);
    }
  };

  const checkForWin = () => {
    const sortedStones = {
      [StoneColor.WHITE]: [] as Stone[],
      [StoneColor.RED]: [] as Stone[]
    };

    for (const stone of stones) {
      sortedStones[stone.color].push(stone);
    }

    if (sortedStones[StoneColor.WHITE].length === 0) {
      winnerIndex = CheckersPlayerIndex.RED;
      return;
    } else if (sortedStones[StoneColor.RED].length === 0) {
      winnerIndex = CheckersPlayerIndex.WHITE;
      return;
    }

    const myColor = turn;
    const myAvailableMoves = sortedStones[myColor].reduce(
      (acc, stone) => acc + stone.possibleMoves.length,
      0
    );

    if (myAvailableMoves === 0) {
      winnerIndex = getPlayerIndexFromColor(getOppositeColor(myColor));
      return;
    }

    if (movesWithoutCapture >= 15) winnerIndex = CheckersPlayerIndex.BOTH;
  };

  const move = (moveData: MoveData): boolean => {
    if (winnerIndex !== null) return false;

    const from = new Point(moveData.from);
    const to = new Point(moveData.to);

    const stone = getStone(from);
    if (!stone) return false;

    const stoneMove = stone.possibleMoves.find(({ position }) => position.eq(to));
    if (!stoneMove) return false;

    stone.position = stoneMove.position;
    if (stoneMove.attackedStone) {
      stones = stones.filter((stone) => stone !== stoneMove.attackedStone);

      calculateAllPossibleMoves();
      const hasAnotherAttack = stone.possibleMoves.some(({ attackedStone }) => !!attackedStone);

      if (!hasAnotherAttack) {
        changeTurn();
        calculateAllPossibleMoves();

        if (
          ((stone.color === StoneColor.WHITE && stone.position.y === 7) ||
            (stone.color === StoneColor.RED && stone.position.y === 0)) &&
          !stone.isDame
        ) {
          stone.isDame = true;
          calculateAllPossibleMoves();
        }
      }

      movesWithoutCapture = 0;
    } else {
      changeTurn();

      if (
        ((stone.color === StoneColor.WHITE && stone.position.y === 7) ||
          (stone.color === StoneColor.RED && stone.position.y === 0)) &&
        !stone.isDame
      )
        stone.isDame = true;

      calculateAllPossibleMoves();
      movesWithoutCapture++;
    }

    stones = stones.sort((a, b) => Point.comparator(a.position, b.position));

    checkForWin();

    return true;
  };

  calculateAllPossibleMoves();
  return {
    move,
    getStone,
    get stones() {
      return stones;
    },
    get nextPlayerIndex() {
      return getPlayerIndexFromColor(turn);
    },
    get winnerIndex() {
      return winnerIndex;
    }
  };
};
