<script lang="ts">
	import Button, { Icon } from '@smui/button';
	import CircularProgress from '@smui/circular-progress';

	export let loading = false;
	export let disabled = false;
	export let icon = '';

	interface $$Props {
		loading?: boolean;
		disabled?: boolean;
		type?: string;
		icon?: string;
	}
</script>

<Button
	on:click
	variant="raised"
	class="custom-button"
	{...$$restProps}
	disabled={disabled || loading}
>
	{#if loading}
		<CircularProgress class="button-loader" indeterminate />
	{/if}
	<div class="hidden inner-button" class:hidden={loading}>
		{#if icon}
			<Icon class="material-icons">{icon}</Icon>
		{/if}
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

		.inner-button {
			display: inline-flex;
			align-items: center;
			line-height: 17px;
		}

		.hidden {
			visibility: hidden;
		}
	}
</style>
