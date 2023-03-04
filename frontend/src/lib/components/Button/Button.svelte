<script lang="ts">
	import Button from '@smui/button';
	import CircularProgress from '@smui/circular-progress';
	import Loader from '../Loader/Loader.svelte';

	export let loading = false;
	export let disabled = false;

	interface $$Props {
		loading?: boolean;
		disabled?: boolean;
		type?: string;
	}
</script>

<Button variant="raised" class="custom-button" {...$$restProps} disabled={disabled || loading}>
	{#if loading}
		<CircularProgress class="button-loader" indeterminate />
	{/if}
	<div class="hidden" class:hidden={loading}>
		<slot />
	</div>
</Button>

<style lang="scss">
	:global(.custom-button) {
		position: relative;

		:global(.button-loader) {
			position: absolute;
			height: 100%;
			width: 100%;
		}

		.hidden {
			visibility: hidden;
		}
	}
</style>
