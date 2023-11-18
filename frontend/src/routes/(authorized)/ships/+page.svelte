<script>
  import GameView from '$lib/components/GameView/GameView.svelte';
  import ShipsBoard from '$lib/components/ShipsBoard/ShipsBoard.svelte';
  import { shipsGameControllerFactory } from '@shared/gameControllers';

  const shipsController = shipsGameControllerFactory();

  let ships = shipsController.ships;
</script>

<div class="boards-container">
  <ShipsBoard {ships} />
  <ShipsBoard />
</div>
<button
  on:click={() => {
    shipsController.randomizePlacement();
    ships = [...shipsController.ships];
  }}>Losuj</button
>

<style lang="scss">
  .boards-container {
    display: flex;
    flex-direction: column;

    gap: 2rem;
  }
</style>
