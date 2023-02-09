<script lang="ts">
	import { STARTER_CHESS_FEN } from '$lib/constants';
	import Board from '$lib/Board/Board.svelte';
	import { getGameFromFENString, ChessGame, Point } from '@shared/classes';
	import type { BoardData, BoardItem } from '$lib/Board/types';
	import type { Piece } from '@shared/types';

	const chessGame: ChessGame = getGameFromFENString(STARTER_CHESS_FEN);

	let pieces = chessGame.pieces;

	let markedFields: Point[] = [];

	const getBoardData = (pieces: Piece[], markedFields: Point[]): BoardData => {
		const boardData: BoardData = [];

		let currentPieceIndex = 0;
		let currentMarkedFieldIndex = 0;

		for (let y = 0; y < 8; y++) {
			const rank: BoardItem[] = [];

			for (let x = 0; x < 8; x++) {
				const cell: BoardItem = {};

				if (pieces.at(currentPieceIndex)?.position.eq(x, y)) {
					const piece = pieces[currentPieceIndex];
					currentPieceIndex++;
					cell.imgUrl = `/svg/chess/${piece.color}_${piece.type}.svg`;
					cell.draggable = piece.color === chessGame.turn;
				}

				if (markedFields.at(currentMarkedFieldIndex)?.eq(x, y)) {
					currentMarkedFieldIndex++;
					cell.marked = true;
				}

				rank.push(cell);
			}

			boardData.push(rank);
		}

		return boardData;
	};

	$: boardData = getBoardData(pieces, markedFields);

	const handleMove = (initialPosition: Point, newPosition: Point) => {
		if (!chessGame.move(initialPosition, newPosition)) return;

		pieces = [...chessGame.pieces];
	};

	const handleDragStart = (position: Point) => {
		const piece = chessGame.getPiece(position);
		if (!piece) return;

		markedFields = [...piece.possibleMoves];
	};

	const handleDragEnd = () => {
		if (!markedFields.length) return;

		markedFields = [];
	};
</script>

<Board
	data={boardData}
	onMove={handleMove}
	onDragStart={handleDragStart}
	onDragEnd={handleDragEnd}
/>
