<script lang="ts">
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import List, { Item, Text } from '@smui/list';
	import Menu from '@smui/menu';
	import { playerStore, authStore, sidebarStore } from '$lib/stores';

	let open = false;
</script>

<TopAppBar class="custom-app-bar" variant="static">
	<Row>
		<Section>
			<IconButton
				on:click={() => {
					sidebarStore.toggle();
				}}
				class="material-icons">menu</IconButton
			>
			<Title><a href="/">Games App</a></Title>
		</Section>
		<Section align="end" toolbar>
			<div>
				<Button on:click={() => (open = !open)}>
					<Label><span>{$playerStore?.nickname}</span></Label>
					{#if open}
						<Icon class="material-icons" on>expand_less</Icon>
					{:else}
						<Icon class="material-icons">expand_more</Icon>
					{/if}
				</Button>
				<Menu bind:open anchorCorner="BOTTOM_START">
					<List>
						<Item on:SMUI:action={() => authStore.logout()}>
							<Text>Wyloguj</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</Section>
	</Row>
</TopAppBar>

<style lang="scss">
	@use '@material/theme/color-palette';
	@use '@material/top-app-bar';

	:global(.custom-app-bar) {
		@include top-app-bar.fill-color(color-palette.$blue-grey-700);
	}

	a {
		text-decoration: none;
		color: inherit;
	}
	span {
		text-transform: none;
	}
</style>
