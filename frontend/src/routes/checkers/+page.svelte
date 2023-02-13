<script lang="ts">
	import Board from '$lib/Board/Board.svelte';
	import type { BoardData, BoardItem } from '$lib/Board/types';
	import { getInitialCheckersGame, Point } from '@shared/classes';
	import type { Stone } from '@shared/types';

	const checkersGame = getInitialCheckersGame();
	let stones = checkersGame.stones;
	let markedFields: Point[] = [];

	$: boardData = getBoardData(stones, markedFields);

	const getBoardData = (stones: Stone[], markedFields: Point[]): BoardData => {
		let currentStonesIndex = 0;
		let currentMarkedFieldsIndex = 0;
		const boardData: BoardData = [];

		for (let y = 0; y <= 7; y++) {
			const rank: BoardItem[] = [];
			boardData.push(rank);

			for (let x = 0; x <= 7; x++) {
				const item: BoardItem = {};

				if (stones.at(currentStonesIndex)?.position.eq(x, y)) {
					const stone = stones[currentStonesIndex];

					item.imgUrl = `/svg/checkers/${stone.color}_${stone.isDame ? 'dame' : 'stone'}.svg`;
					item.draggable = stone.color === checkersGame.turn && !!stone.possibleMoves.length;

					currentStonesIndex++;
				}

				if (markedFields.at(currentMarkedFieldsIndex)?.eq(x, y)) {
					item.marked = true;

					currentMarkedFieldsIndex++;
				}

				rank.push(item);
			}
		}

		return boardData;
	};

	const handleMove = (initialPosition: Point, newPosition: Point) => {
		const stone = checkersGame.getStone(initialPosition);
		if (!stone) return;

		const move = stone.possibleMoves.find((move) => move.position.eq(newPosition));
		if (!move) return;

		if (!checkersGame.move(stone, move)) return;
		stones = [...checkersGame.stones];
	};

	const handleDragStart = (position: Point) => {
		const stone = checkersGame.getStone(position);
		if (!stone) return;

		markedFields = stone.possibleMoves.map(({ position }) => position);
	};

	const handleDragEnd = () => {
		markedFields = [];
	};
</script>

<Board
	data={boardData}
	onMove={handleMove}
	onDragEnd={handleDragEnd}
	onDragStart={handleDragStart}
/>
