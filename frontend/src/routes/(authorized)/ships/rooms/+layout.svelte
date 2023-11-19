<script lang="ts" context="module">
  export type ShipsContext = Readable<WsShipsClient | null>;

  export const shipsContextKey = Symbol();
</script>

<script lang="ts">
  import { wsShipsClient, type WsShipsClient } from '$lib/api/wsShips';

  import { getWsClientStore } from '$lib/stores/socket';
  import { onDestroy, onMount, setContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const clientStore = getWsClientStore<WsShipsClient>();

  onMount(async () => {
    const wsClient = await wsShipsClient();
    clientStore.setClient(wsClient);
  });

  onDestroy(async () => {
    const client = $clientStore;

    if (!client) return;

    client.socket.close();
    clientStore.clearClient();
  });

  setContext<ShipsContext>(shipsContextKey, clientStore);
</script>

<slot />
