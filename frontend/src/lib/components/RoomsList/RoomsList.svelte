<script lang="ts">
	import type { RoomInfo } from '@shared/types';
	import Card from '@smui/card/src/Card.svelte';
	import Button from '../Button/Button.svelte';
	import Loader from '../Loader/Loader.svelte';
	import NoRooms from './components/NoRooms.svelte';
	import RoomsListTable from './components/RoomsListTable.svelte';

	export let data: RoomInfo[] | null;
	export let title: string;
	export let onNewRoomClick: () => Promise<void>;
	export let isCreating = false;

	export let onRoomJoin: (id: string) => void;
</script>

<div class="container">
	<div class="container__inner">
		<div class="container__card">
			<Card class="outer-card">
				<div class="header">
					<div class="mdc-typography--headline2">{title}</div>
					<Button loading={isCreating} on:click={onNewRoomClick} icon="add">Nowy pokój</Button>
				</div>
				{#if data === null}
					<Loader show={true} />
				{:else if data.length > 0}
					<RoomsListTable {data} {onRoomJoin} />
				{:else}
					<NoRooms />
				{/if}
			</Card>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		flex-grow: 1;
		height: 100%;

		&__inner {
			max-width: 800px;
			flex-grow: 1;
		}

		&__card {
			display: flex;
			flex-direction: column;
			height: 100%;
			padding-bottom: 100px;
		}

		:global(.outer-card) {
			padding: 20px;
			height: 100%;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
