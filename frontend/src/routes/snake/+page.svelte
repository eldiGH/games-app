<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CellType, getSnake, type SnakeGameField } from '../../lib/snake';

	let field: SnakeGameField = [];

	const cols = 20;
	const rows = 20;

	let snake: ReturnType<typeof getSnake> | undefined;

	onMount(() => {
		snake = getSnake(cols, rows);

		snake.enableGameLoop((newField) => {
			field = newField;
		}, 50);

		snake.registerKeys();
	});

	onDestroy(() => {
		snake?.unregisterKeys();
		snake?.disableGameLoop();
		snake = undefined;
	});
</script>

<div class="field" style={`--cols: ${cols}; --rows: ${rows};`}>
	{#each field as column}
		<div>
			{#each column as cell}
				<div
					class="cell"
					class:head={cell === CellType.HEAD}
					class:apple={cell === CellType.APPLE}
					class:tail={cell === CellType.TAIL}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	.field {
		--cell-size: 25px;

		background-color: black;
		display: inline-flex;
		min-width: calc(var(--cell-size) * cols);
		min-height: calc(var(--cell-size) * rows);
	}

	.cell {
		width: var(--cell-size);
		height: var(--cell-size);
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
