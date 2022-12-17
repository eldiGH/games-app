interface Point {
	x: number;
	y: number;
}

interface Snake {
	head: Point;
	tail: Point[];
	apple: Point;
	maxLen: number;
	direction: Direction;
}

export enum CellType {
	BLANK,
	HEAD,
	TAIL,
	APPLE
}

enum Direction {
	NONE,
	UP,
	RIGHT,
	DOWN,
	LEFT
}

export type SnakeGameField = CellType[][];

export const getSnake = (width: number, height: number) => {
	const snake: Snake = {
		head: { x: 0, y: 0 },
		tail: [],
		apple: { x: 0, y: 0 },
		maxLen: 0,
		direction: Direction.NONE
	};
	let oldGameField: SnakeGameField = [];

	let keyListener: ((e: KeyboardEvent) => void) | undefined = undefined;
	let loopTimeout: NodeJS.Timeout | undefined = undefined;

	const getNewApplePos = (): Point => {
		const snakeWidth = snake.tail.length + 1;
		const availableSpace = width * height - snakeWidth;
		let applePos = Math.floor(Math.random() * availableSpace);

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				if (
					!(snake.head.x === x && snake.head.y === y) &&
					!snake.tail.find((point) => point.x === x && point.y === y)
				)
					applePos--;

				if (applePos <= 0) return { x, y };
			}
		}

		return { x: -1, y: -1 };
	};

	const reset = () => {
		snake.head.x = Math.floor(width / 2);
		snake.head.y = Math.floor(height / 2);
		snake.apple = getNewApplePos();
		snake.maxLen = 3;
		snake.direction = Direction.NONE;

		snake.tail = [];
		for (let i = 0; i < snake.maxLen - 1; i++) {
			snake.tail.push({ x: snake.head.x, y: snake.head.y });
		}

		oldGameField = [];

		for (let x = 0; x < width; x++) {
			oldGameField.push([]);
			for (let y = 0; y < height; y++) {
				let type: CellType;

				if (snake.head.x === x && snake.head.y === y) type = CellType.HEAD;
				else if (snake.apple.x === x && snake.apple.y === y) type = CellType.APPLE;
				else type = CellType.BLANK;

				oldGameField[x].push(type);
			}
		}

		return oldGameField;
	};

	const iterate = (): SnakeGameField => {
		const { direction, tail, head, maxLen, apple } = snake;

		if (direction === Direction.NONE) return oldGameField;

		let lastSegmentToClear: Point | undefined = undefined;

		if (tail.length + 1 < maxLen) {
			tail.push({ ...(tail.at(-1) as Point) });
		} else lastSegmentToClear = tail.at(-1);

		for (let i = tail.length - 1; i > 0; i--) {
			tail[i].x = tail[i - 1].x;
			tail[i].y = tail[i - 1].y;
		}

		tail[0].x = head.x;
		tail[0].y = head.y;

		switch (direction) {
			case Direction.UP:
				head.y -= 1;
				break;
			case Direction.RIGHT:
				head.x += 1;
				break;
			case Direction.DOWN:
				head.y += 1;
				break;
			case Direction.LEFT:
				head.x -= 1;
				break;
		}

		if (head.x < 0) head.x = width - 1;
		else if (head.x >= width) head.x = 0;
		else if (head.y < 0) head.y = height - 1;
		else if (head.y >= height) head.y = 0;

		if (head.x === apple.x && head.y === apple.y) {
			snake.maxLen++;
			snake.apple = getNewApplePos();
		} else if (tail.find(({ x, y }) => head.x === x && head.y === y)) {
			return reset();
		}

		oldGameField[head.x][head.y] = CellType.HEAD;
		oldGameField[tail[0].x][tail[0].y] = CellType.TAIL;
		oldGameField[apple.x][apple.y] = CellType.APPLE;
		if (lastSegmentToClear)
			oldGameField[lastSegmentToClear.x][lastSegmentToClear.y] = CellType.BLANK;

		return oldGameField;
	};

	const registerKeys = () => {
		if (keyListener) return;

		keyListener = ({ key }) => {
			switch (key) {
				case 'w':
					snake.direction = Direction.UP;
					break;
				case 'd':
					snake.direction = Direction.RIGHT;
					break;
				case 's':
					snake.direction = Direction.DOWN;
					break;
				case 'a':
					snake.direction = Direction.LEFT;
					break;
			}
		};

		document.addEventListener('keypress', keyListener);
	};

	const unregisterKeys = () => {
		if (!keyListener) return;

		document.removeEventListener('keypress', keyListener);

		keyListener = undefined;
	};

	const enableGameLoop = (callback: (field: SnakeGameField) => void, interval: number) => {
		if (loopTimeout) return;

		callback(oldGameField);

		const iteration = () => {
			loopTimeout = setTimeout(() => {
				callback(iterate());
				iteration();
			}, interval);
		};

		iteration();
	};

	const disableGameLoop = () => {
		if (!loopTimeout) return;

		clearTimeout(loopTimeout);
		loopTimeout = undefined;
	};

	reset();

	return { iterate, registerKeys, unregisterKeys, enableGameLoop, disableGameLoop };
};
