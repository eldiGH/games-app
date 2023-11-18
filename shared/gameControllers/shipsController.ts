import { Point } from '@shared/classes';
import { ShipType, type Ship, type ShipTemplate } from '@shared/types';

const SHIP_LAYOUTS: ShipTemplate[] = [
  { count: 1, size: 5, type: ShipType.Carrier },
  { count: 1, size: 4, type: ShipType.Battleship },
  { count: 3, size: 3, type: ShipType.Submarine },
  { count: 2, size: 2, type: ShipType.Destroyer }
];

export interface ShipsGameController {
  readonly isMyTurn: boolean;
  readonly isPlacing: boolean;
  readonly shotsOnMe: Point[];
  readonly shotsOnEnemy: Point[];
  readonly ships: Ship[];
  shotMe: (point: Point) => boolean;
  shoot: (point: Point) => boolean;
  randomizePlacement: () => void;
}

const getShip = (startPoint: Point, direction: number, template: ShipTemplate): Ship => {
  const ship: Ship = { type: template.type, points: [startPoint] };

  for (let i = 1; i < template.size; i++) {
    switch (direction) {
      case 0:
        ship.points.push(startPoint.add(0, i));
        break;
      case 1:
        ship.points.push(startPoint.add(i, 0));
        break;
      case 2:
        ship.points.push(startPoint.add(0, -i));
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
  const direction = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    switch ((direction + i) % 4) {
      case 0:
        if (startPoint.within(0, 0 + size, 10, 10)) {
          return getShip(startPoint, 0, template);
        }
        break;
      case 1:
        if (startPoint.within(0, 0, 10 - size, 10)) {
          return getShip(startPoint, 1, template);
        }
        break;
      case 2:
        if (startPoint.within(0, 0, 10, 10 - size)) {
          return getShip(startPoint, 2, template);
        }
        break;
      default:
        if (startPoint.within(0 + size, 0, 10, 10)) {
          return getShip(startPoint, 3, template);
        }
        break;
    }
  }

  return getShip(startPoint, 0, template);
};

export const shipsGameControllerFactory = (): ShipsGameController => {
  let isMyTurn = true;
  const isPlacing = true;

  const shotsOnMe: Point[] = [];
  const shotsOnEnemy: Point[] = [];
  const ships: Ship[] = [];

  const shotMe = (point: Point): boolean => {
    if (isMyTurn) {
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
    isMyTurn = true;
    return true;
  };

  const shoot = (point: Point): boolean => {
    if (!isMyTurn) {
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
    isMyTurn = true;
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
            const shipMin = ship.points[0];
            const shipMax = ship.points[ship.points.length - 1];

            if (shipMin.within(min, max) || shipMax.within(min, max)) {
              success = false;
              break;
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

  return {
    shotMe,
    shoot,
    randomizePlacement,
    get isMyTurn() {
      return isMyTurn;
    },
    get isPlacing() {
      return isPlacing;
    },
    get shotsOnMe() {
      return shotsOnMe;
    },
    get shotsOnEnemy() {
      return shotsOnEnemy;
    },
    get ships() {
      return ships;
    }
  };
};
