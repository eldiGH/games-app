import { Point } from '@shared/classes';
import { StoneColor, type GameControllerFactory, type Stone, type StoneMove } from '@shared/types';

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

export const checkersControllerFactory: GameControllerFactory = () => {
  let stones: Stone[] = getInitialStones();
  let turn: StoneColor = StoneColor.WHITE;

  const getStone = (position: Point) => {
    return stones.find((stone) => stone.position.eq(position));
  };

  const changeTurn = () => {
    turn = turn === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;
  };

  const availableMoves = (stone: Stone): StoneMove[] => {
    if (stone.color !== turn) return [];

    const availableMoves: StoneMove[] = [];
    const signMultiplier = stone.color === StoneColor.WHITE ? 1 : -1;
    const oppositeColor = stone.color === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;

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

  const move = (from: Point, to: Point): boolean => {
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
    } else {
      changeTurn();

      if (
        ((stone.color === StoneColor.WHITE && stone.position.y === 7) ||
          (stone.color === StoneColor.RED && stone.position.y === 0)) &&
        !stone.isDame
      ) {
        stone.isDame = true;
        calculateAllPossibleMoves();
      }

      calculateAllPossibleMoves();
    }

    stones = stones.sort((a, b) => Point.comparator(a.position, b.position));

    return true;
  };

  calculateAllPossibleMoves();

  return { move };
};
