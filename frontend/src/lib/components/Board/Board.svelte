<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { BoardData, DraggedItem, Boundary } from './types';
	import { Point } from '@shared/classes';

	export let data: BoardData;
	export let reversed = false;

	export let onMove: (initialPosition: Point, newPosition: Point) => void;
	export let onDragStart: (position: Point) => void;
	export let onDragEnd: () => void;

	let boardRef: HTMLDivElement;
	let draggedItem: null | DraggedItem = null;

	const handleItemPickup = (e: MouseEvent, x: number, y: number) => {
		e.preventDefault();
		if (e.button !== 0) return;

		const piece = data[y][x];

		if (!piece || !piece.draggable) return;

		const ref = boardRef.children[y].children[x].children[0] as HTMLImageElement;

		const boundary: Boundary = {
			x: boardRef.offsetLeft,
			y: boardRef.offsetTop,
			xMax: boardRef.offsetLeft + boardRef.offsetWidth,
			yMax: boardRef.offsetTop + boardRef.offsetHeight
		};

		draggedItem = { x, y, ref, offsetLeft: ref.offsetLeft, offsetTop: ref.offsetTop, boundary };
		onDragStart(new Point(x, y));
	};

	const handleItemMove = (mouse: MouseEvent) => {
		mouse.preventDefault();

		if (!draggedItem) return;

		const { ref, offsetLeft, offsetTop, boundary } = draggedItem;

		if (
			mouse.pageX < boundary.x ||
			mouse.pageY < boundary.y ||
			mouse.pageX > boundary.xMax ||
			mouse.pageY > boundary.yMax
		) {
			ref.style.left = '';
			ref.style.top = '';

			draggedItem = null;
			return;
		}

		ref.style.left = `${mouse.pageX - offsetLeft - ref.width / 2}px`;
		ref.style.top = `${mouse.pageY - offsetTop - ref.height / 2}px`;
	};

	const handleItemDrop = (e: MouseEvent) => {
		e.stopPropagation();
		if (!draggedItem) return;

		draggedItem.ref.hidden = true;
		const elementBelow = document.elementFromPoint(e.offsetX, e.offsetY);
		draggedItem.ref.hidden = false;

		if (elementBelow?.hasAttribute('data-x') && elementBelow?.hasAttribute('data-y')) {
			const x = parseInt(elementBelow.getAttribute('data-x') ?? '');
			const y = parseInt(elementBelow.getAttribute('data-y') ?? '');

			onMove(new Point(draggedItem.x, draggedItem.y), new Point(x, y));
		}

		draggedItem.ref.style.left = '';
		draggedItem.ref.style.top = '';

		draggedItem = null;
		onDragEnd();
	};

	onMount(() => {
		document.addEventListener('mousemove', handleItemMove);
	});

	onDestroy(() => {
		if (!browser) return;

		document.removeEventListener('mousemove', handleItemMove);
	});
</script>

<div class="board-container" class:reversed>
	<div class="board" bind:this={boardRef}>
		{#each data as rows, y}
			<div class="row">
				{#each rows as cell, x}
					<div
						class="cell"
						class:cell--other={(y + x) % 2 === 0}
						class:marked={cell.marked && draggedItem}
						class:marked--img={cell.marked && cell.imgUrl && draggedItem}
						data-x={x}
						data-y={y}
					>
						{#if cell.imgUrl}
							<img
								draggable
								on:mousedown={(e) => handleItemPickup(e, x, y)}
								on:mouseup={handleItemDrop}
								src={cell.imgUrl}
								alt="item"
								data-x={x}
								data-y={y}
								class:held={draggedItem && draggedItem.x === x && draggedItem.y === y}
								class:draggable={cell.draggable}
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.board {
		user-select: none;
		display: inline-flex;
		flex-direction: column-reverse;

		&-container {
			padding: 16px;
			background-color: #312e2b;
			display: inline-block;
		}
	}

	.row {
		display: inline-flex;
	}

	.cell {
		width: 64px;
		height: 64px;
		background-color: #845c38;

		img {
			width: 64px;
			height: 64px;

			position: relative;
			outline-color: transparent;
		}

		.draggable {
			cursor: grab;

			outline: transparent solid 3px;
			outline-offset: -3px;
			transition: outline-color 0.2s ease-in-out;

			&:hover {
				outline-color: white;
			}
		}

		.held {
			cursor: grabbing;
			z-index: 10;

			outline: none;
		}

		&--other {
			background-color: #caad7b;
		}
	}

	.marked {
		&::before {
			content: '';
			width: 32px;
			height: 32px;
			display: block;
			position: absolute;

			transform: translate(50%, 50%);

			opacity: 0.4;
			border-radius: 50%;

			animation: 0.2s normal 1 forwards background;
		}
	}

	.marked--img {
		&::before {
			width: 64px;
			height: 64px;
			transform: none;

			outline: transparent solid 5px;
			outline-offset: -5px;
			background-color: transparent;

			border-radius: 0;

			animation: 0.2s normal 1 forwards outline;
		}
	}

	.row {
		display: flex;
	}

	.reversed {
		.board {
			flex-direction: column;
		}

		.row {
			flex-direction: row-reverse;
		}
	}

	@keyframes background {
		from {
			background-color: transparent;
		}
		to {
			background-color: black;
		}
	}

	@keyframes outline {
		from {
			outline-color: transparent;
		}
		to {
			outline-color: black;
		}
	}
</style>
