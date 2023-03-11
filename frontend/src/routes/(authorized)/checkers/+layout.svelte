<script lang="ts" context="module">
	export type CheckersContext = Readable<WsCheckersClient | null>;

	export const checkersContextKey = Symbol();
</script>

<script lang="ts">
	import { wsCheckersClient, type WsCheckersClient } from '$lib/api/wsCheckers';
	import { getWsClientStore } from '$lib/stores/socket';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const clientStore = getWsClientStore<WsCheckersClient>();

	onMount(async () => {
		const wsClient = await wsCheckersClient();
		clientStore.setClient(wsClient);
	});

	onDestroy(async () => {
		const client = $clientStore;

		if (!client) return;

		client.socket.close();
		clientStore.clearClient();
	});

	setContext<CheckersContext>(checkersContextKey, clientStore);
</script>

<slot />
