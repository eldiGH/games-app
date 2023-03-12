<script lang="ts">
	import { getRoomStatusLabels } from '$lib/helpers';
	import { RoomStatus } from '@shared/types';

	export let status: RoomStatus;
</script>

<div
	class="status"
	class:status__waiting={status === RoomStatus.Waiting}
	class:status__full={status === RoomStatus.Full}
	class:status__playing={status === RoomStatus.Playing}
>
	{getRoomStatusLabels(status)}
</div>

<style lang="scss">
	.status {
		color: white;
		display: inline-block;
		padding: 5px 15px;
		border-radius: 15px;
		width: 100px;
		text-align: center;

		&__waiting {
			background: #219107;
		}

		&__full {
			background: #bd5e15;
		}

		&__playing {
			background: #c71414;
		}
	}
</style>
