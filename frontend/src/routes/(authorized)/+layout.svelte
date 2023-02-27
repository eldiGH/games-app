<script lang="ts">
	import { goto } from '$app/navigation';
	import AppBar from '$lib/components/AppBar/AppBar.svelte';
	import Container from '$lib/components/Container/Container.svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';
	import { isAuthed } from '$lib/stores/auth';
	import { playerStore, isPlayerDataLoading } from '$lib/stores';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';

	$: if (!$isAuthed) goto('/login');
</script>

{#if $isPlayerDataLoading}
	<Loader show />
{:else if $playerStore}
	<AppBar />
	<div>
		<Sidebar>
			<Container>
				<slot />
			</Container>
		</Sidebar>
	</div>
{/if}

<style lang="scss">
	div {
		position: relative;
		flex-grow: 1;
		overflow: hidden;
		display: flex;
	}
</style>
