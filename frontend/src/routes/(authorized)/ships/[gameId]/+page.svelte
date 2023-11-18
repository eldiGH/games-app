<script lang="ts">
  import ShipsBoard from '$lib/components/ShipsBoard/ShipsBoard.svelte';
  import { shipsContextKey, type ShipsContext } from '../+layout.svelte';
  import { page } from '$app/stores';
  import { getContext } from 'svelte';
  import GameView from '$lib/components/GameView/GameView.svelte';
  import { playerStore } from '$lib/stores';
  import type { Point } from '@shared/classes';

  const clientStore = getContext<ShipsContext>(shipsContextKey);
  $: client = $clientStore;
  $: isMyTurnStore = client?.isMyTurn;
  $: isMyTurn = $isMyTurnStore;

  $: myBoard = client?.myBoard;
  $: enemyBoard = client?.enemyBoard;

  const randomizeMyShips = () => {
    $clientStore?.randomizeShipPlacement();
  };

  $: room = $clientStore?.room;

  $: {
    if ($clientStore) {
      $clientStore.join($page.params.gameId);
    }
  }

  let myIndex: number | undefined | null;
  $: myIndex = $room?.players.findIndex(
    (player) => player && player.nickname === $playerStore?.nickname
  );

  const handleClick = (e: CustomEvent<{ point: Point }>) => {
    const { point } = e.detail;

    client?.shoot(point);
  };
</script>

<div class="boards-container">
  <GameView
    horizontal
    client={$clientStore}
    room={$room}
    additionalButtonsWhenSat={[{ content: 'Losuj statki', onClick: randomizeMyShips }]}
  >
    <div class="boards" class:reversed={myIndex !== 0}>
      <ShipsBoard shipsBoard={$myBoard ?? []} />
      <ShipsBoard on:click={handleClick} shipsBoard={$enemyBoard ?? []} clickable={isMyTurn} />
    </div>
  </GameView>
</div>

<style lang="scss">
  .boards-container {
    display: flex;
    justify-content: center;
    gap: 2rem;

    .boards {
      display: flex;

      &.reversed {
        flex-direction: row-reverse;
      }
    }
  }
</style>
