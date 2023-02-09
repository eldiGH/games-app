export class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        return new Point(this.x + x, this.y + y);
    }
    yEq(y) {
        return y === this.y;
    }
    xEq(x) {
        return x === this.x;
    }
    addY(y) {
        return new Point(this.x, this.y + y);
    }
    addX(x) {
        return new Point(this.x + x, this.y);
    }
    gtEq(xOrPoint, y) {
        if (typeof xOrPoint === 'number' && typeof y === 'number')
            return this.x >= xOrPoint && this.y >= y;
        if (typeof xOrPoint === 'object')
            return this.x >= xOrPoint.x && this.y >= xOrPoint.y;
        return false;
    }
    ltEq(xOrPoint, y) {
        if (typeof xOrPoint === 'number' && typeof y === 'number')
            return this.x <= xOrPoint && this.y <= y;
        if (typeof xOrPoint === 'object')
            return this.x <= xOrPoint.x && this.y <= xOrPoint.y;
        return false;
    }
    within(xMin, yMin, xMax, yMax) {
        return this.gtEq(xMin, yMin) && this.ltEq(xMax, yMax);
    }
    eq(pointOrX, y) {
        if (typeof pointOrX === 'number')
            return this.x === pointOrX && this.y === y;
        return this.x === pointOrX.x && this.y === pointOrX.y;
    }
    getVector(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }
    getPointInTheMiddle(point) {
        return new Point(Math.round((this.x + point.x) / 2), Math.round((this.y + point.y) / 2));
    }
    static comparator(a, b) {
        if (a.y > b.y)
            return 1;
        if (a.y < b.y)
            return -1;
        if (a.x > b.x)
            return 1;
        if (a.x < b.x)
            return -1;
        return 0;
    }
}
//# sourceMappingURL=utils.js.map