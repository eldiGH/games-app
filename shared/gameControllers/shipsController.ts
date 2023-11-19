import { Point } from '@shared/classes';
import { ShipType, type Ship, type ShipTemplate, ShotOutcome } from '@shared/types';

enum ShipDirection {
  Up,
  Right,
  Down,
  Left
}

const SHIP_LAYOUTS: Record<ShipType, { count: number; size: number }> = {
  [ShipType.Carrier]: { count: 1, size: 5 },
  [ShipType.Battleship]: { count: 1, size: 4 },
  [ShipType.Submarine]: { count: 3, size: 3 },
  [ShipType.Destroyer]: { count: 2, size: 2 }
} as const;

export interface ShipsGameController {
  readonly isMyTurn: boolean;
  readonly shotsOnMe: Point[];
  readonly shotsOnEnemy: Point[];
  readonly missesOnEnemy: Point[];
  readonly ships: Ship[];
  readonly lost: boolean;
  shootMe: (point: Point) => ShotOutcome;
  shoot: (
    point: Point,
    outcomeGetter: () => Promise<ShotOutcome> | ShotOutcome
  ) => Promise<boolean>;
  randomizePlacement: () => void;
  setShips: (ships: Ship[]) => void;
  setMyTurn: (isMyTurn: boolean) => void;
  setTurnUpdateListener: (callback: (turn: boolean) => void) => void;
  resetGameState: () => void;
}

const getShip = (
  startPoint: Point,
  direction: ShipDirection,
  template: ShipTemplate,
  shipType: ShipType
): Ship => {
  const ship: Ship = { type: shipType, points: [startPoint], timesShot: 0, sunk: false };

  for (let i = 1; i < template.size; i++) {
    switch (direction) {
      case ShipDirection.Up:
        ship.points.push(startPoint.add(0, -i));
        break;
      case ShipDirection.Right:
        ship.points.push(startPoint.add(i, 0));
        break;
      case ShipDirection.Down:
        ship.points.push(startPoint.add(0, i));
        break;
      default:
        ship.points.push(startPoint.add(-i, 0));
        break;
    }
  }

  ship.points.sort(Point.comparator);
  return ship;
};

const randomizeShip = (template: ShipTemplate, shipType: ShipType): Ship => {
  const { size } = template;

  const startPoint = Point.getRandom(0, 0, 10, 10);
  const direction: ShipDirection = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    switch (((direction + i) % 4) as ShipDirection) {
      case ShipDirection.Up:
        if (startPoint.within(0, 0 + size, 10, 10)) {
          return getShip(startPoint, ShipDirection.Up, template, shipType);
        }
        break;
      case ShipDirection.Right:
        if (startPoint.within(0, 0, 10 - size, 10)) {
          return getShip(startPoint, ShipDirection.Right, template, shipType);
        }
        break;
      case ShipDirection.Down:
        if (startPoint.within(0, 0, 10, 10 - size)) {
          return getShip(startPoint, ShipDirection.Down, template, shipType);
        }
        break;
      default:
        if (startPoint.within(0 + size, 0, 10, 10)) {
          return getShip(startPoint, ShipDirection.Left, template, shipType);
        }
        break;
    }
  }

  return getShip(startPoint, 0, template, shipType);
};

export const shipsGameControllerFactory = (): ShipsGameController => {
  let _isMyTurn = false;

  const shotsOnMe: Point[] = [];
  const shotsOnEnemy: Point[] = [];
  const missesOnEnemy: Point[] = [];
  let lost = false;

  const ships: Ship[] = [];

  let turnUpdateListener: ((turn: boolean) => void) | null = null;

  const shootMe = (point: Point): ShotOutcome => {
    if (_isMyTurn) {
      return ShotOutcome.Error;
    }

    if (!point.within(0, 0, 10, 10)) {
      return ShotOutcome.Error;
    }

    const alreadyShot = shotsOnMe.find((p) => point.eq(p));
    if (alreadyShot) {
      return ShotOutcome.Error;
    }

    shotsOnMe.push(point);

    const hitShip = ships.find(({ points }) => points.find((p) => point.eq(p)));
    if (!hitShip) {
      setMyTurn(true);
      return ShotOutcome.Miss;
    }

    hitShip.timesShot++;

    if (hitShip.timesShot >= SHIP_LAYOUTS[hitShip.type].size) {
      hitShip.sunk = true;

      let min = hitShip.points[0].add(-1, -1);
      if (min.x < 0) min = min.addX(1);
      if (min.y < 0) min = min.addY(1);

      let max = hitShip.points[hitShip.points.length - 1].add(1, 1);
      if (max.x >= 10) max = max.addX(-1);
      if (max.y >= 10) max = max.addY(-1);

      for (let y = min.y; y <= max.y; y++) {
        for (let x = min.x; x <= max.x; x++) {
          if (!shotsOnMe.find((p) => p.eq(x, y))) {
            shotsOnMe.push(new Point(x, y));
          }
        }
      }

      if (ships.every(({ sunk }) => sunk)) {
        lost = true;
      } else {
        setMyTurn(true);
      }

      return ShotOutcome.Sunk;
    }

    setMyTurn(true);
    return ShotOutcome.Hit;
  };

  const shoot = async (
    point: Point,
    outcomeGetter: (point: Point) => Promise<ShotOutcome> | ShotOutcome
  ): Promise<boolean> => {
    if (!_isMyTurn) {
      return false;
    }

    if (!point.within(0, 0, 10, 10)) {
      return false;
    }
    const alreadyShot = shotsOnEnemy.find((p) => point.eq(p));
    if (alreadyShot) {
      return false;
    }

    setMyTurn(false);

    const outcome = await outcomeGetter(point);

    switch (outcome) {
      case ShotOutcome.Miss:
        missesOnEnemy.push(point);
        break;
      case ShotOutcome.Hit:
      case ShotOutcome.Sunk:
        shotsOnEnemy.push(point);
        break;
      case ShotOutcome.Error:
        return false;
    }

    if (outcome === ShotOutcome.Sunk) {
      const enemyShip: Point[] = [point];

      const possibleLocations = shotsOnEnemy.filter(
        (shot) => shot.x === point.x || shot.y === shot.y
      );

      let isAbove = true;
      let isBelow = true;
      let isLeft = true;
      let isRight = true;

      for (let i = 1; i < 5; i++) {
        if (isAbove) {
          const checkedPoint = point.addY(i);

          if (possibleLocations.find((p) => p.eq(checkedPoint))) {
            enemyShip.push(checkedPoint);
          } else {
            isAbove = false;
          }
        }

        if (isBelow) {
          const checkedPoint = point.addY(-i);

          if (possibleLocations.find((p) => p.eq(checkedPoint))) {
            enemyShip.push(checkedPoint);
          } else {
            isBelow = false;
          }
        }

        if (isLeft) {
          const checkedPoint = point.addX(-i);

          if (possibleLocations.find((p) => p.eq(checkedPoint))) {
            enemyShip.push(checkedPoint);
          } else {
            isLeft = false;
          }
        }

        if (isRight) {
          const checkedPoint = point.addX(i);

          if (possibleLocations.find((p) => p.eq(checkedPoint))) {
            enemyShip.push(checkedPoint);
          } else {
            isRight = false;
          }
        }

        if (!isAbove && !isBelow && !isLeft && !isRight) {
          break;
        }
      }

      enemyShip.sort(Point.comparator);

      let min = enemyShip[0].add(-1, -1);
      if (min.x < 0) min = min.addX(1);
      if (min.y < 0) min = min.addY(1);

      let max = enemyShip[enemyShip.length - 1].add(1, 1);
      if (max.x >= 10) max = max.addX(-1);
      if (max.y >= 10) max = max.addY(-1);

      for (let y = min.y; y <= max.y; y++) {
        for (let x = min.x; x <= max.x; x++) {
          if (!missesOnEnemy.find((p) => p.eq(x, y)) && !enemyShip.find((p) => p.eq(x, y))) {
            missesOnEnemy.push(new Point(x, y));
          }
        }
      }
    }

    return true;
  };

  const clearEnemySideShots = () => {
    shotsOnEnemy.splice(0);
    missesOnEnemy.splice(0);
  };

  const clearShotsOnMe = () => {
    shotsOnMe.splice(0);
  };

  const resetShipsStats = () => {
    for (const ship of ships) {
      ship.sunk = false;
      ship.timesShot = 0;
    }
  };

  const resetGameState = () => {
    clearEnemySideShots();
    clearShotsOnMe();
    resetShipsStats();
  };

  const randomizePlacement = () => {
    ships.splice(0);
    shotsOnMe.splice(0);

    const shipTypes = Object.keys(SHIP_LAYOUTS).map((k) => Number(k)) as ShipType[];
    for (const shipType of shipTypes) {
      const template = SHIP_LAYOUTS[shipType as unknown as ShipType];

      for (let shipIndex = 0; shipIndex < template.count; shipIndex++) {
        for (let attempt = 0; attempt < 10; attempt++) {
          const newShip = randomizeShip(template, shipType);

          const min = newShip.points[0].add(-1, -1);
          const max = newShip.points[template.size - 1].add(1, 1);

          let success = true;
          for (const ship of ships) {
            for (const point of ship.points) {
              if (point.within(min, max) || point.within(min, max)) {
                success = false;
                break;
              }
            }
          }

          if (success) {
            ships.push(newShip);
            break;
          }

          if (attempt >= 9) {
            randomizePlacement();
            return;
          }
        }
      }
    }
  };

  const setShips = (shipsLayout: Ship[]) => {
    ships.splice(0);

    ships.push(...shipsLayout);
  };

  const setMyTurn = (isMyTurn: boolean) => {
    _isMyTurn = isMyTurn;
    turnUpdateListener?.(isMyTurn);
  };

  const setTurnUpdateListener = (callback: (turn: boolean) => void) => {
    turnUpdateListener = callback;
  };

  return {
    shootMe,
    shoot,
    randomizePlacement,
    setShips,
    setMyTurn,
    setTurnUpdateListener,
    resetGameState,
    get isMyTurn() {
      return _isMyTurn;
    },
    get shotsOnMe() {
      return shotsOnMe;
    },
    get shotsOnEnemy() {
      return shotsOnEnemy;
    },
    get missesOnEnemy() {
      return missesOnEnemy;
    },
    get ships() {
      return ships;
    },
    get lost() {
      return lost;
    }
  };
};
