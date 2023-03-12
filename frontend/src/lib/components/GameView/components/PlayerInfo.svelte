<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import type { PlayerWithRating } from '@shared/types';

	export let player: PlayerWithRating | null;
	export let alreadySitting: boolean;
	export let onSit: () => void;
</script>

<div class="container">
	{#if player}
		{player.nickname}&nbsp;({player.rating})
	{:else}
		<div class="free-spot">
			<Button on:click={onSit}>
				{#if alreadySitting}
					Przesiądź się
				{:else}
					Usiądź
				{/if}
			</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		height: 60px;
		margin: 10px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.free-spot {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
