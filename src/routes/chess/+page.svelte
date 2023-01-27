<script lang="ts">
	enum Piece {
		ROOK = 'rook',
		QUEEN = 'queen',
		KING = 'king',
		PAWN = 'pawn',
		BISHOP = 'bishop',
		KNIGHT = 'knight'
	}

	enum PieceColor {
		WHITE = 'white',
		BLACK = 'black'
	}

	interface Field {
		piece: Piece;
		color: PieceColor;
	}

	let field: (Field | null)[][] = [
		[
			{ piece: Piece.ROOK, color: PieceColor.BLACK },
			{ piece: Piece.KNIGHT, color: PieceColor.BLACK },
			{ piece: Piece.BISHOP, color: PieceColor.BLACK },
			{ piece: Piece.QUEEN, color: PieceColor.BLACK },
			{ piece: Piece.KING, color: PieceColor.BLACK },
			{ piece: Piece.BISHOP, color: PieceColor.BLACK },
			{ piece: Piece.KNIGHT, color: PieceColor.BLACK },
			{ piece: Piece.ROOK, color: PieceColor.BLACK }
		],
		[
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK },
			{ piece: Piece.PAWN, color: PieceColor.BLACK }
		],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE },
			{ piece: Piece.PAWN, color: PieceColor.WHITE }
		],
		[
			{ piece: Piece.ROOK, color: PieceColor.WHITE },
			{ piece: Piece.KNIGHT, color: PieceColor.WHITE },
			{ piece: Piece.BISHOP, color: PieceColor.WHITE },
			{ piece: Piece.QUEEN, color: PieceColor.WHITE },
			{ piece: Piece.KING, color: PieceColor.WHITE },
			{ piece: Piece.BISHOP, color: PieceColor.WHITE },
			{ piece: Piece.KNIGHT, color: PieceColor.WHITE },
			{ piece: Piece.ROOK, color: PieceColor.WHITE }
		]
	];
</script>

{#each field as rows, y}
	<div class="row">
		{#each rows as cell, x}
			<div class="field" class:field--other={(y + x) % 2 === 0}>
				{#if cell}
					<img alt={`${cell.color} ${cell.piece}`} src={`/svg/${cell.color}_${cell.piece}.svg`} />
				{/if}
			</div>
		{/each}
	</div>
{/each}

<style lang="scss">
	.field {
		width: 64px;
		height: 64px;
		background-color: #779556;

		img {
			width: 64px;
			height: 64px;

			position: relative;
			cursor: grab;
		}

		&--other {
			background-color: #ebecd0;
		}
	}

	.row {
		display: flex;
	}
</style>
