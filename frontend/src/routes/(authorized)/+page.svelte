<script lang="ts">
	import GameCard from '$lib/components/GameCard/GameCard.svelte';
	import type { CardData } from '$lib/components/GameCard/GameCard.svelte';

	const cards: CardData[] = [
		{ title: 'Szachy', url: '/chess', img: '/chess.png' },
		{ title: 'Warcaby', url: '/chess', img: '/chess.png' },
		{ title: 'Statki', url: '/chess', img: '/chess.png' },
		{ title: 'Kółko i krzyżyk', url: '/chess', img: '/chess.png' },
		{ title: 'Saper', url: '/chess', img: '/chess.png' },
		{ title: 'Snake', url: '/chess', img: '/chess.png' }
	];
</script>

<div class="container">
	{#each cards as card}
		<div class="card-container">
			<GameCard data={card} />
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 100px;
		padding-bottom: 200px;

		@media (max-width: 1670px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 1100px) {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.card-container {
		display: flex;
		justify-content: center;
	}
</style>
