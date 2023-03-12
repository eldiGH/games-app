<script lang="ts">
	import type { RoomInfo } from '@shared/types';
	import DataTable, { Head, Body, Row, Cell, SortValue, Label } from '@smui/data-table';
	import { formatTime, getRoomStatusLabels } from '$lib/helpers';
	import IconButton from '@smui/icon-button';
	import { sortHelper } from '$lib/helpers/sort';
	import RoomStatusTag from './RoomStatusTag.svelte';

	export let data: RoomInfo[];
	export let onRoomJoin: (id: string) => void;

	enum ColumnName {
		Players = 'players',
		Status = 'status',
		Time = 'time'
	}

	let sort: ColumnName = ColumnName.Status;
	let sortDirection: SortValue = SortValue.ASCENDING;

	const sortData = (data: RoomInfo[], sort: ColumnName, sortDirection: SortValue): RoomInfo[] => {
		console.log({ sort, sortDirection });

		return data.sort((a, b) => {
			const multiplier = sortDirection === SortValue.ASCENDING ? 1 : -1;

			const playerARating = a.players[0] !== null ? a.playersInRoom[a.players[0]].rating : 0;
			const playerBRating = b.players[0] !== null ? b.playersInRoom[b.players[0]].rating : 0;

			const statusCriteria = a.status - b.status;
			const ratingCriteria = playerARating - playerBRating;
			const timeCriteria = a.time - b.time;

			switch (sort) {
				case ColumnName.Status:
					return sortHelper([statusCriteria * multiplier, ratingCriteria, timeCriteria]);
				case ColumnName.Players:
					return sortHelper([ratingCriteria * multiplier, statusCriteria, timeCriteria]);
				case ColumnName.Time:
					return sortHelper([timeCriteria * multiplier, statusCriteria, ratingCriteria]);
			}
		});
	};

	let sortedData: RoomInfo[];
	$: sortedData = sortData(data, sort, sortDirection);
</script>

<DataTable bind:sort bind:sortDirection sortable stickyHeader class="rooms-list-table">
	<Head>
		<Row>
			<Cell style="width: 100%;" columnId={ColumnName.Players}>
				<Label>Gracze</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
			<Cell columnId={ColumnName.Status}>
				<Label>Status</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
			<Cell style="min-width: 120px;" columnId={ColumnName.Time}>
				<Label>Czas</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
		</Row>
	</Head>
	<Body>
		{#each sortedData as room (room.id)}
			<Row on:click={() => onRoomJoin(room.id)}>
				<Cell>
					<div>
						{#each room.players as player}
							<div>
								{#if player !== null}
									{room.playersInRoom[player].nickname}&nbsp;({room.playersInRoom[player].rating})
								{:else}
									<span class="free">&lt;wolne&gt;</span>
								{/if}
							</div>
						{/each}
					</div>
				</Cell>
				<Cell class="status-cell">
					<RoomStatusTag status={room.status} />
				</Cell>
				<Cell>{formatTime(room.time)}</Cell>
			</Row>
		{/each}
	</Body>
</DataTable>

<style lang="scss">
	:global(.rooms-list-table) {
		width: 100%;
		height: 100%;
		margin-top: 20px;
		overflow-y: auto;
		user-select: none;

		:global(.mdc-data-table__row) {
			cursor: pointer;
			height: 80px;
		}
	}

	.free {
		color: lime;
	}
</style>
