<script lang="ts" context="module">
  export type ChessContext = Readable<WsChessClient | null>;

  export const chessContextKey = Symbol();
</script>

<script lang="ts">
  import { wsChessClient, type WsChessClient } from '$lib/api/wsChess';
  import { getWsClientStore } from '$lib/stores/socket';
  import { onDestroy, onMount, setContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const clientStore = getWsClientStore<WsChessClient>();

  onMount(async () => {
    const wsClient = await wsChessClient();
    clientStore.setClient(wsClient);
  });

  onDestroy(async () => {
    const client = $clientStore;

    if (!client) return;

    client.socket.close();
    clientStore.clearClient();
  });

  setContext<ChessContext>(chessContextKey, clientStore);
</script>

<slot />
