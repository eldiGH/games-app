<script lang="ts">
	import type { ChessBoard } from '$lib/types';
	import { getPiecesFromFenString } from '$lib/helpers';
	import { STARTER_CHESS_FEN } from '$lib/constants';
	import Board from '$lib/Board/Board.svelte';

	let chessBoard: ChessBoard = getPiecesFromFenString(STARTER_CHESS_FEN);
	let isWhiteTurn = true;

	let isDragging: boolean = false;

	$: boardData = chessBoard.map((ranks) =>
		ranks.map((boardItem) => ({
			imgUrl: boardItem.piece
				? `/svg/${boardItem.piece.color}_${boardItem.piece.type}.svg`
				: undefined,
			draggable: boardItem.piece ? true : false,
			// (isWhiteTurn && piece.color === PieceColor.WHITE) ||
			// (!isWhiteTurn && piece.color === PieceColor.BLACK),
			marked: isDragging && boardItem.cellOptions?.marked
		}))
	);

	const handleMove = (initialX: number, initialY: number, newX: number, newY: number) => {
		const boardData = chessBoard[initialY][initialX];
		if (!boardData?.piece) return;

		const { piece } = boardData;

		if (!piece.canMoveTo(newX, newY, piece, chessBoard)) return;

		chessBoard[newY][newX].piece = piece;
		chessBoard[initialY][initialX].piece = undefined;

		chessBoard = [...chessBoard];
	};

	const handleDragStart = (x: number, y: number) => {
		const boardData = chessBoard[y][x];

		if (!boardData.piece) return;

		const { piece } = boardData;

		const availableMoves = piece.availableMoves(piece, chessBoard);

		for (const availableMove of availableMoves) {
			chessBoard[availableMove.y][availableMove.x].cellOptions = { marked: true };
		}

		isDragging = true;
	};

	const handleDragEnd = () => {
		isDragging = false;

		for (const row of chessBoard) {
			for (const cell of row) {
				cell.cellOptions = undefined;
			}
		}
	};
</script>

<Board
	data={boardData}
	onMove={handleMove}
	onDragStart={handleDragStart}
	onDragEnd={handleDragEnd}
/>
