<script lang="ts">
	import type { WsCheckersClient } from '$lib/api/wsCheckers';
	import { playerStore } from '$lib/stores';
	import type { PlayerWithRating, RoomInfo } from '@shared/types';
	import Loader from '../Loader/Loader.svelte';
	import PlayerInfo from './components/PlayerInfo.svelte';

	export let room: RoomInfo | null | undefined;
	export let client: WsCheckersClient | null;

	const getPlayers = (room: RoomInfo) => {
		return room.players.map((playerIndex) =>
			playerIndex !== null && room ? room.playersInRoom[playerIndex] : null
		);
	};

	let players: (PlayerWithRating | null)[];
	$: players = room ? getPlayers(room) : [];
</script>

{#if room}
	<div class="container">
		<div>
			<PlayerInfo
				me={$playerStore?.nickname ?? ''}
				leader={room.leader}
				slot={0}
				{players}
				{client}
			/>
			<slot />
			<PlayerInfo
				me={$playerStore?.nickname ?? ''}
				leader={room.leader}
				slot={1}
				{players}
				{client}
			/>
		</div>
	</div>
{:else}
	<Loader show />
{/if}

<style lang="scss">
	.container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
