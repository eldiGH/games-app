<script lang="ts">
  import { page } from '$app/stores';
  import Chess from '$lib/components/Chess/Chess.svelte';
  import GameView from '$lib/components/GameView/GameView.svelte';
  import { getContext } from 'svelte';
  import { chessContextKey, type ChessContext } from '../+layout.svelte';

  const client = getContext<ChessContext>(chessContextKey);

  $: room = $client?.room;

  $: {
    if ($client) {
      $client.join($page.params.gameId);
    }
  }
</script>

<GameView client={$client}>
  <Chess client={$client} />
</GameView>
