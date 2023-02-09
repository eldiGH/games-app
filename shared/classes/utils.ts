export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(x: number, y: number) {
		return new Point(this.x + x, this.y + y);
	}

	yEq(y: number) {
		return y === this.y;
	}

	xEq(x: number) {
		return x === this.x;
	}

	addY(y: number) {
		return new Point(this.x, this.y + y);
	}

	addX(x: number) {
		return new Point(this.x + x, this.y);
	}

	gtEq(x: number, y: number): boolean;
	gtEq(point: Point): boolean;
	gtEq(xOrPoint: number | Point, y?: number): boolean {
		if (typeof xOrPoint === 'number' && typeof y === 'number')
			return this.x >= xOrPoint && this.y >= y;
		if (typeof xOrPoint === 'object') return this.x >= xOrPoint.x && this.y >= xOrPoint.y;
		return false;
	}

	ltEq(x: number, y: number): boolean;
	ltEq(point: Point): boolean;
	ltEq(xOrPoint: number | Point, y?: number): boolean {
		if (typeof xOrPoint === 'number' && typeof y === 'number')
			return this.x <= xOrPoint && this.y <= y;
		if (typeof xOrPoint === 'object') return this.x <= xOrPoint.x && this.y <= xOrPoint.y;
		return false;
	}

	within(xMin: number, yMin: number, xMax: number, yMax: number): boolean {
		return this.gtEq(xMin, yMin) && this.ltEq(xMax, yMax);
	}

	eq({ x, y }: Point): boolean;
	eq(x: number, y: number): boolean;
	eq(pointOrX: Point | number, y?: number): boolean {
		if (typeof pointOrX === 'number') return this.x === pointOrX && this.y === y;
		return this.x === pointOrX.x && this.y === pointOrX.y;
	}

	getVector(point: Point): Point {
		return new Point(this.x - point.x, this.y - point.y);
	}

	getPointInTheMiddle(point: Point) {
		return new Point(Math.round((this.x + point.x) / 2), Math.round((this.y + point.y) / 2));
	}

	static comparator(a: Point, b: Point) {
		if (a.y > b.y) return 1;
		if (a.y < b.y) return -1;

		if (a.x > b.x) return 1;
		if (a.x < b.x) return -1;

		return 0;
	}
}
