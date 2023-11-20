<script lang="ts">
  import type { GetRankingResponse } from '@shared/schemas';
  import DataTable, { Head, Body, Row, Cell, SortValue, Label } from '@smui/data-table';

  import IconButton from '@smui/icon-button';
  import { onMount } from 'svelte';
  import type { GameType } from '@prisma/client';
  import Loader from '../Loader/Loader.svelte';
  import Card from '@smui/card';
  import { getRankings } from '$lib/api/rankings.Client';

  export let title: string;
  export let gameType: GameType;

  let data: GetRankingResponse | null = null;

  enum ColumnName {
    Player = 'player',
    Points = 'points',
    Won = 'won',
    Lost = 'lost'
  }

  let sort: ColumnName = ColumnName.Points;
  let sortDirection: SortValue = SortValue.DESCENDING;

  const getData = async () => {
    const response = await getRankings(gameType);

    if (response.data) data = response.data;
  };

  onMount(() => {
    getData();
  });
</script>

{#if data}
  <div class="container">
    <Card class="card">
      <div class="header mdc-typography--headline2">{title}</div>

      {#if data.length > 0}
        <DataTable bind:sort bind:sortDirection sortable stickyHeader>
          <Head>
            <Row>
              <Cell columnId={ColumnName.Player}>
                <Label>Gracz</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell
                columnId={ColumnName.Points}
                class="mdc-data-table__header-cell--sorted-descending"
              >
                <Label>Punkty</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell columnId={ColumnName.Won}>
                <Label>Zwycięstwa</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell columnId={ColumnName.Lost}>
                <Label>Porażki</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
            </Row>
          </Head>
          <Body>
            {#each data as item (item.player)}
              <Row>
                <Cell>{item.player}</Cell>
                <Cell numeric>{item.value}</Cell>
                <Cell numeric>{item.won}</Cell>
                <Cell numeric>{item.lost}</Cell>
              </Row>
            {/each}
          </Body>
        </DataTable>
      {:else}
        <div class="header">Brak rankingów do pokazania</div>
      {/if}
    </Card>
  </div>
{:else}
  <Loader show />
{/if}

<style lang="scss">
  .container {
    padding: 1rem 5rem;

    .header {
      text-align: center;
    }

    :global(.card) {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  }
</style>
