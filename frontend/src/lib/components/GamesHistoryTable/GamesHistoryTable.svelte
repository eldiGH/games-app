<script lang="ts">
  import type { GetMatchHistoryResponse } from '@shared/schemas';
  import DataTable, { Head, Body, Row, Cell, SortValue, Label } from '@smui/data-table';
  import format from 'date-fns/format';

  import IconButton from '@smui/icon-button';
  import { getMatchHistory } from '$lib/api/matchHistoryClient';
  import { onMount } from 'svelte';
  import type { GameType } from '@prisma/client';
  import Loader from '../Loader/Loader.svelte';
  import Card from '@smui/card';

  export let title: string;
  export let gameType: GameType;

  let data: GetMatchHistoryResponse | null = null;

  enum ColumnName {
    OpponentName = 'opponentData',
    Result = 'result',
    Points = 'points',
    OpponentRankingBefore = 'players',
    OpponentRankingAfter = 'status',
    Date = 'time'
  }

  let sort: ColumnName = ColumnName.Date;
  let sortDirection: SortValue = SortValue.DESCENDING;

  const getData = async () => {
    const response = await getMatchHistory(gameType);

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
              <Cell columnId={ColumnName.OpponentName}>
                <Label>Przeciwnik</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell columnId={ColumnName.Result}>
                <Label>Wynik</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell columnId={ColumnName.Points}>
                <Label>Punkty</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
              <Cell
                columnId={ColumnName.Date}
                class="mdc-data-table__header-cell--sorted-descending"
              >
                <Label>Data</Label>
                <IconButton class="material-icons">arrow_upward</IconButton>
              </Cell>
            </Row>
          </Head>
          <Body>
            {#each data as item (item.date)}
              <Row>
                <Cell>{item.opponent.name}</Cell>
                <Cell style={`color: ${item.won ? 'lime' : 'red'}`}
                  >{item.won ? 'Wygrana' : 'Porażka'}</Cell
                >
                <Cell numeric>{`${item.won ? '' : '-'}${item.transferredPoints}`}</Cell>
                <Cell>{format(item.date, 'HH:mm dd.MM.yyyy')}</Cell>
              </Row>
            {/each}
          </Body>
        </DataTable>
      {:else}
        <div class="header">Brak partii do pokazania</div>
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
