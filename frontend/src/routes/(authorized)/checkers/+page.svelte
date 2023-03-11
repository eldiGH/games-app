<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { checkersContextKey, type CheckersContext } from './+layout.svelte';
	import { WsMessageType, type RoomInfo } from '@shared/types';

	const clientStore = getContext<CheckersContext>(checkersContextKey);

	let rooms: RoomInfo[] = [];

	const roomListUpdateHandler = (data: RoomInfo[]) => {
		rooms = data;
		console.log('!!!!');
	};

	$: {
		$clientStore?.subscribeList();
		$clientStore?.addMessageListener(WsMessageType.RoomsList, roomListUpdateHandler);
	}

	onDestroy(() => {
		$clientStore?.unsubscribeList();
	});
</script>

<svelte:head>
	<title>GamesApp - Warcaby</title>
</svelte:head>

{#each rooms as room}
	<div>{room.id}</div>
{/each}
