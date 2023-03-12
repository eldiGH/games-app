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

	const handleSit = (index: number) => () => {
		client?.sit(index);
	};

	let players: (PlayerWithRating | null)[];
	$: players = room ? getPlayers(room) : [];

	let alreadySitting: boolean;
	$: alreadySitting = players.some((player) => player?.nickname === $playerStore?.nickname);
</script>

{#if room}
	<div class="container">
		<div>
			<PlayerInfo {alreadySitting} onSit={handleSit(0)} player={players[0]} />
			<slot />
			<PlayerInfo {alreadySitting} onSit={handleSit(1)} player={players[1]} />
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
