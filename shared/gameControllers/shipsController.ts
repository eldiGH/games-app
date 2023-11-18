import { Point } from '@shared/classes';
import { ShipType, type Ship, type ShipTemplate } from '@shared/types';

enum ShipDirection {
  Up,
  Right,
  Down,
  Left
}

const SHIP_LAYOUTS: ShipTemplate[] = [
  { count: 1, size: 5, type: ShipType.Carrier },
  { count: 1, size: 4, type: ShipType.Battleship },
  { count: 3, size: 3, type: ShipType.Submarine },
  { count: 2, size: 2, type: ShipType.Destroyer }
];

export interface ShipsGameController {
  readonly isMyTurn: boolean;
  readonly shotsOnMe: Point[];
  readonly shotsOnEnemy: Point[];
  readonly missesOnEnemy: Point[];
  readonly ships: Ship[];
  shootMe: (point: Point) => boolean;
  shoot: (point: Point) => boolean;
  randomizePlacement: () => void;
  setShips: (ships: Ship[]) => void;
  setMyTurn: (isMyTurn: boolean) => void;
  setTurnUpdateListener: (callback: (turn: boolean) => void) => void;
}

const getShip = (startPoint: Point, direction: ShipDirection, template: ShipTemplate): Ship => {
  const ship: Ship = { type: template.type, points: [startPoint] };

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

const randomizeShip = (template: ShipTemplate): Ship => {
  const { size } = template;

  const startPoint = Point.getRandom(0, 0, 10, 10);
  const direction: ShipDirection = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    switch (((direction + i) % 4) as ShipDirection) {
      case ShipDirection.Up:
        if (startPoint.within(0, 0 + size, 10, 10)) {
          return getShip(startPoint, ShipDirection.Up, template);
        }
        break;
      case ShipDirection.Right:
        if (startPoint.within(0, 0, 10 - size, 10)) {
          return getShip(startPoint, ShipDirection.Right, template);
        }
        break;
      case ShipDirection.Down:
        if (startPoint.within(0, 0, 10, 10 - size)) {
          return getShip(startPoint, ShipDirection.Down, template);
        }
        break;
      default:
        if (startPoint.within(0 + size, 0, 10, 10)) {
          return getShip(startPoint, ShipDirection.Left, template);
        }
        break;
    }
  }

  return getShip(startPoint, 0, template);
};

export const shipsGameControllerFactory = (): ShipsGameController => {
  let _isMyTurn = false;

  const shotsOnMe: Point[] = [];
  const shotsOnEnemy: Point[] = [];
  const missesOnEnemy: Point[] = [];

  const ships: Ship[] = [];

  let turnUpdateListener: ((turn: boolean) => void) | null = null;

  const shootMe = (point: Point): boolean => {
    if (_isMyTurn) {
      return false;
    }

    if (!point.within(0, 0, 10, 10)) {
      return false;
    }

    const alreadyShot = shotsOnMe.find(point.eq);
    if (alreadyShot) {
      return false;
    }

    shotsOnMe.push(point);
    setMyTurn(true);
    return true;
  };

  const shoot = (point: Point): boolean => {
    if (!_isMyTurn) {
      return false;
    }

    if (!point.within(0, 0, 10, 10)) {
      return false;
    }
    const alreadyShot = shotsOnEnemy.find(point.eq);
    if (alreadyShot) {
      return false;
    }

    shotsOnEnemy.push(point);
    setMyTurn(false);
    return true;
  };

  const randomizePlacement = () => {
    ships.splice(0);

    for (const template of SHIP_LAYOUTS) {
      for (let shipIndex = 0; shipIndex < template.count; shipIndex++) {
        for (let attempt = 0; attempt < 10; attempt++) {
          const newShip = randomizeShip(template);

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
    }
  };
};
