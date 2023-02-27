<script lang="ts">
	import { sidebarStore } from '$lib/stores';
	import Drawer, { AppContent, Content, Header, Subtitle, Title } from '@smui/drawer';
	import Accordion, {
		Panel,
		Header as AccordionHeader,
		Content as AccordionContent
	} from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';

	let chessOpen = false;
	let checkersOpen = false;
	let shipsOpen = false;
	let ticTacToeOpen = false;
	let minesweeperOpen = false;
</script>

<Drawer variant="dismissible" bind:open={$sidebarStore}>
	<Header>
		<Title>Gry</Title>
	</Header>
	<Content>
		<Accordion multiple>
			<Panel bind:open={chessOpen}>
				<AccordionHeader>
					Szachy
					<IconButton tabindex={-1} slot="icon" toggle pressed={chessOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</AccordionHeader>
				<AccordionContent>
					<List>
						<Item>
							<Text>Graj</Text>
						</Item>
						<Item>
							<Text>Rankingi</Text>
						</Item>
						<Item>
							<Text>Moja historia</Text>
						</Item>
					</List>
				</AccordionContent>
			</Panel>
			<Panel bind:open={checkersOpen}>
				<AccordionHeader>
					Warcaby
					<IconButton tabindex={-1} slot="icon" toggle pressed={checkersOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</AccordionHeader>
				<AccordionContent>
					<List>
						<Item>
							<Text>Graj</Text>
						</Item>
						<Item>
							<Text>Rankingi</Text>
						</Item>
						<Item>
							<Text>Moja historia</Text>
						</Item>
					</List>
				</AccordionContent>
			</Panel>
			<Panel bind:open={shipsOpen}>
				<AccordionHeader>
					Statki
					<IconButton tabindex={-1} slot="icon" toggle pressed={shipsOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</AccordionHeader>
				<AccordionContent>
					<List>
						<Item>
							<Text>Graj</Text>
						</Item>
						<Item>
							<Text>Rankingi</Text>
						</Item>
						<Item>
							<Text>Moja historia</Text>
						</Item>
					</List>
				</AccordionContent>
			</Panel>
			<Panel bind:open={ticTacToeOpen}>
				<AccordionHeader>
					Kółko i Krzyżyk
					<IconButton tabindex={-1} slot="icon" toggle pressed={ticTacToeOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</AccordionHeader>
				<AccordionContent>
					<List>
						<Item>
							<Text>Graj</Text>
						</Item>
						<Item>
							<Text>Rankingi</Text>
						</Item>
						<Item>
							<Text>Moja historia</Text>
						</Item>
					</List>
				</AccordionContent>
			</Panel>
			<Panel bind:open={minesweeperOpen}>
				<AccordionHeader>
					Saper
					<IconButton tabindex={-1} slot="icon" toggle pressed={minesweeperOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</AccordionHeader>
				<AccordionContent>
					<List>
						<Item>
							<Text>Graj</Text>
						</Item>
						<Item>
							<Text>Rankingi</Text>
						</Item>
						<Item>
							<Text>Moja historia</Text>
						</Item>
					</List>
				</AccordionContent>
			</Panel>
		</Accordion>
	</Content>
</Drawer>
<AppContent>
	<slot />
</AppContent>
