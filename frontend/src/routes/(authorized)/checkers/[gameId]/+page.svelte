<script lang="ts">
	import { page } from '$app/stores';
	import Checkers from '$lib/components/Checkers/Checkers.svelte';
	import GameView from '$lib/components/GameView/GameView.svelte';
	import { getContext } from 'svelte';
	import { checkersContextKey, type CheckersContext } from '../+layout.svelte';

	const client = getContext<CheckersContext>(checkersContextKey);

	$: room = $client?.room;

	$: {
		if ($client) {
			$client.join($page.params.gameId);
		}
	}
</script>

<GameView client={$client} room={$room}>
	<Checkers />
</GameView>
