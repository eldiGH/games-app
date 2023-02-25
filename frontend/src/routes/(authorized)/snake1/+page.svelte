<script lang="ts">
	import { onMount } from 'svelte';

	const fieldSize = 81;

	enum FieldType {
		BLANK,
		HEAD,
		TAIL,
		APPLE
	}

	enum Key {
		NONE = 0,
		UP = -9,
		RIGHT = 1,
		DOWN = 9,
		LEFT = -1
	}

	let field: FieldType[] = [];

	let direction = 0;

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'w':
					if (direction !== Key.DOWN) direction = Key.UP;
					break;
				case 'd':
					if (direction !== Key.LEFT) direction = Key.RIGHT;
					break;
				case 's':
					if (direction !== Key.UP) direction = Key.DOWN;
					break;
				case 'a':
					if (direction !== Key.RIGHT) direction = Key.LEFT;
					break;
				case 'r':
					gameLoop();
					break;
			}
		});
		reset();
	});

	let length = 3;
	const snake: { head: number; tail: number[]; apple: number } = { head: 0, tail: [], apple: -1 };

	const getNewApplePos = () => {
		const availableSpace = fieldSize - (snake.tail.length + 1);
		let randomIndex = Math.floor(Math.random() * (availableSpace - 1));

		let finalIndex = 0;
		while (randomIndex > 0) {
			finalIndex++;
			if (snake.head !== finalIndex && !snake.tail.includes(finalIndex)) randomIndex--;
		}
		return finalIndex;
	};

	const reset = () => {
		const newField: FieldType[] = [];

		snake.head = Math.floor(fieldSize / 2);
		snake.tail = [];
		snake.apple = getNewApplePos();
		length = 3;
		direction = 0;

		for (let i = 0; i < fieldSize; i++) {
			switch (i) {
				case snake.head:
					newField.push(FieldType.HEAD);
					break;
				case snake.apple:
					newField.push(FieldType.APPLE);
					break;
				default:
					newField.push(FieldType.BLANK);
			}
		}

		field = newField;
	};

	const gameLoop = () => {
		if (direction === 0) return;

		const newField: FieldType[] = [...field];

		let oldLastTail: number | undefined =
			snake.tail.length === length - 1 ? snake.tail.at(-1) : undefined;

		if (snake.tail.length < length - 1) {
			const tailPos = snake.tail.at(-1);
			snake.tail.push(tailPos ? tailPos : snake.head);
		}

		if (snake.tail.length) {
			for (let i = snake.tail.length - 1; i > 0; i--) {
				snake.tail[i] = snake.tail[i - 1];
			}
			snake.tail[0] = snake.head;
		}

		const newHeadIndex = snake.head + direction;

		if ((snake.head - 8) % 9 === 0 && direction === Key.RIGHT) snake.head -= 8;
		else if (snake.head % 9 === 0 && direction === Key.LEFT) snake.head += 8;
		else if (newHeadIndex < 0) snake.head += 72;
		else if (newHeadIndex >= fieldSize) snake.head -= 72;
		else if (snake.tail.includes(newHeadIndex)) return reset();
		else snake.head += direction;

		if (snake.head === snake.apple) {
			length++;
			snake.apple = getNewApplePos();
		}

		if (snake.apple < 0) {
			snake.apple = getNewApplePos();
		}

		if (oldLastTail !== undefined) {
			newField[oldLastTail] = FieldType.BLANK;
		}
		newField[snake.head] = FieldType.HEAD;
		newField[snake.tail[0]] = FieldType.TAIL;
		if (snake.apple >= 0) newField[snake.apple] = FieldType.APPLE;

		field = newField;

		setTimeout(gameLoop, 100);
	};
</script>

<div class="main">
	{#each field as cell}
		<div
			class="field"
			class:head={cell === FieldType.HEAD}
			class:tail={cell === FieldType.TAIL}
			class:apple={cell === FieldType.APPLE}
		/>
	{/each}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.main {
		--size: 25px;
		--margin: 2px;
		--grid: 9;

		display: flex;
		background-color: black;
		flex-wrap: wrap;
		width: calc(((var(--size) + (var(--margin) * 2)) * var(--grid)));
	}

	.field {
		width: var(--size);
		height: var(--size);
		margin: var(--margin);
		border-radius: 50%;
	}

	.head {
		background-color: lime;
	}

	.tail {
		background-color: green;
	}

	.apple {
		background-color: red;
	}
</style>
