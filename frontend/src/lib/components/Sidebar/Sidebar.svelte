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
  import Link from '../Link/Link.svelte';

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
            <Link href="/chess/rooms">
              <Item>
                <Text>Graj</Text>
              </Item>
            </Link>
            <Link href="/chess/ranking">
              <Item>
                <Text>Ranking</Text>
              </Item>
            </Link>
            <Link href="/chess/history">
              <Item>
                <Text>Moja historia</Text>
              </Item>
            </Link>
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
            <Link href="/checkers/rooms">
              <Item>
                <Text>Graj</Text>
              </Item>
            </Link>
            <Link href="/checkers/ranking">
              <Item>
                <Text>Ranking</Text>
              </Item>
            </Link>
            <Link href="/checkers/history">
              <Item>
                <Text>Moja historia</Text>
              </Item>
            </Link>
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
            <Link href="/ships/rooms">
              <Item>
                <Text>Graj</Text>
              </Item>
            </Link>
            <Link href="/ships/ranking">
              <Item>
                <Text>Ranking</Text>
              </Item>
            </Link>
            <Link href="/ships/history">
              <Item>
                <Text>Moja historia</Text>
              </Item>
            </Link>
          </List>
        </AccordionContent>
      </Panel>
    </Accordion>
  </Content>
</Drawer>
<AppContent class="app-content">
  <slot />
</AppContent>

<style lang="scss">
  @use '@material/theme/color-palette';

  :global(.app-content) {
    width: 100%;
  }

  :global(.smui-accordion) {
    color: white;
  }

  :global(.smui-accordion__panel) {
    background: color-palette.$blue-grey-700;
  }
</style>
