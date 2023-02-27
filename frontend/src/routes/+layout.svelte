<script lang="ts">
	import '$lib/styles/global.scss';
	import 'material-icons/iconfont/material-icons.css';
	import '@fontsource/roboto/300.css';
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/500.css';
	import '@fontsource/roboto/700.css';
	import '../../../node_modules/svelte-material-ui/bare.css';
	import Notification from '$lib/components/Notification/Notification.svelte';
	import { globalError } from '$lib/stores';
	import ErrorScreen from '$lib/components/ErrorScreen/ErrorScreen.svelte';
</script>

<div>
	<Notification />
	{#if $globalError}
		<ErrorScreen />
	{:else}
		<slot />
	{/if}
</div>

<style lang="scss">
	div {
		height: 100vh;
		width: 100vw;
		overflow: hidden;

		display: flex;
		flex-direction: column;
	}
</style>
