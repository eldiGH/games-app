import { StoneColor } from '@shared/types';
import { Point } from './utils';
export const getInitialCheckersGame = () => {
    const stones = [];
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
    return new CheckersGame(stones.sort((a, b) => Point.comparator(a.position, b.position)), StoneColor.WHITE);
};
export class CheckersGame {
    stones;
    turn;
    constructor(stones, turn) {
        this.stones = stones;
        this.turn = turn;
        this.#calculateAllPossibleMoves();
    }
    getStone(position) {
        return this.stones.find((stone) => stone.position.eq(position));
    }
    #changeTurn() {
        this.turn = this.turn === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;
    }
    #availableMoves(stone) {
        if (stone.color !== this.turn)
            return [];
        const availableMoves = [];
        const signMultiplier = stone.color === StoneColor.WHITE ? 1 : -1;
        const oppositeColor = stone.color === StoneColor.WHITE ? StoneColor.RED : StoneColor.WHITE;
        if (!stone.isDame) {
            for (let x = -1; x <= 1; x += 2) {
                for (let y = -1; y <= 1; y += 2) {
                    const diagonalPoint = stone.position.add(x, y);
                    const diagonalStone = this.getStone(diagonalPoint);
                    if (!diagonalStone && y * signMultiplier > 0)
                        availableMoves.push({ position: diagonalPoint });
                    else if (diagonalStone?.color === oppositeColor) {
                        const diagonalPointBehind = diagonalPoint.add(x, y);
                        const diagonalStoneBehind = this.getStone(diagonalPointBehind);
                        if (!diagonalStoneBehind)
                            availableMoves.push({
                                position: diagonalPointBehind,
                                attackedStone: diagonalStone
                            });
                    }
                }
            }
        }
        else {
            for (let x = -1; x <= 1; x += 2) {
                for (let y = -1; y <= 1; y += 2) {
                    let point = stone.position.add(x, y);
                    while (point.within(0, 0, 7, 7)) {
                        const stone = this.getStone(point);
                        if (!stone)
                            availableMoves.push({ position: point });
                        else if (stone.color === oppositeColor) {
                            point = point.add(x, y);
                            while (point.within(0, 0, 7, 7)) {
                                const stoneBehind = this.getStone(point);
                                if (stoneBehind)
                                    break;
                                availableMoves.push({ position: point, attackedStone: stone });
                                point = point.add(x, y);
                            }
                            break;
                        }
                        else
                            break;
                        point = point.add(x, y);
                    }
                }
            }
        }
        const legalMoves = availableMoves
            .filter((move) => move.position.within(0, 0, 7, 7))
            .sort((a, b) => Point.comparator(a.position, b.position));
        return legalMoves;
    }
    #calculateAllPossibleMoves() {
        for (const stone of this.stones) {
            stone.possibleMoves = this.#availableMoves(stone);
        }
        const hasAnyAttack = this.stones.some(({ possibleMoves }) => possibleMoves.some((move) => !!move.attackedStone));
        if (!hasAnyAttack)
            return;
        for (const stone of this.stones) {
            stone.possibleMoves = stone.possibleMoves.filter(({ attackedStone }) => !!attackedStone);
        }
    }
    move(stone, move) {
        if (!stone.possibleMoves.includes(move))
            return false;
        stone.position = move.position;
        if (move.attackedStone) {
            this.stones = this.stones.filter((stone) => stone !== move.attackedStone);
            this.#calculateAllPossibleMoves();
            const hasAnotherAttack = stone.possibleMoves.some(({ attackedStone }) => !!attackedStone);
            if (!hasAnotherAttack) {
                this.#changeTurn();
                this.#calculateAllPossibleMoves();
                if (((stone.color === StoneColor.WHITE && stone.position.y === 7) ||
                    (stone.color === StoneColor.RED && stone.position.y === 0)) &&
                    !stone.isDame) {
                    stone.isDame = true;
                    this.#calculateAllPossibleMoves();
                }
            }
        }
        else {
            this.#changeTurn();
            if (((stone.color === StoneColor.WHITE && stone.position.y === 7) ||
                (stone.color === StoneColor.RED && stone.position.y === 0)) &&
                !stone.isDame) {
                stone.isDame = true;
                this.#calculateAllPossibleMoves();
            }
            this.#calculateAllPossibleMoves();
        }
        this.stones = this.stones.sort((a, b) => Point.comparator(a.position, b.position));
        return true;
    }
}
//# sourceMappingURL=checkers.js.map