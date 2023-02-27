<script lang="ts">
	import CircularProgress from '@smui/circular-progress';

	export let overlay = false;
	export let show = false;
</script>

{#if show}
	<div class="container" class:container--overlay={overlay}>
		<CircularProgress class="loader" indeterminate />
	</div>
{/if}

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;

		position: absolute;
		top: 0;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		pointer-events: none;

		z-index: 10;

		&--overlay {
			pointer-events: all;
			background-color: rgba(255, 255, 255, 0.7);
		}

		:global(.loader) {
			height: 64px;
			width: 64px;
		}
	}
</style>
