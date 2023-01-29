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
}
