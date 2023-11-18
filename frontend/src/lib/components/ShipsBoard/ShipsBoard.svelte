<script lang="ts">
  import type { ShipsBoard } from '$lib/types/Ships';
  import { Point } from '@shared/classes';
  import { createEventDispatcher } from 'svelte';

  interface Events {
    click: { point: Point };
  }

  export let shipsBoard: ShipsBoard;
  export let clickable = false;

  const dispatch = createEventDispatcher<Events>();
</script>

<div class="root">
  <div class="indicators__horizontal">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
    <div>10</div>
  </div>
  <div class="board-container">
    <div class="indicators__vertical">
      <div>A</div>
      <div>B</div>
      <div>C</div>
      <div>D</div>
      <div>E</div>
      <div>F</div>
      <div>G</div>
      <div>H</div>
      <div>I</div>
      <div>J</div>
    </div>
    <div>
      {#each shipsBoard as row, y}
        <div class="row">
          {#each row as cell, x}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="cell"
              class:ship={cell.hasShip}
              class:miss={cell.hasMiss && !cell.hasShip}
              class:shot={cell.hasShot || (cell.hasMiss && cell.hasShip)}
              class:clickable={clickable && !cell.hasMiss && !cell.hasShot && !cell.hasShip}
              on:click={() => {
                if (clickable && !cell.hasMiss && !cell.hasShot && !cell.hasShip) {
                  dispatch('click', { point: new Point(x, y) });
                }
              }}
            />
          {/each}
        </div>
      {/each}
    </div>
    <div class="indicators__vertical">
      <div>A</div>
      <div>B</div>
      <div>C</div>
      <div>D</div>
      <div>E</div>
      <div>F</div>
      <div>G</div>
      <div>H</div>
      <div>I</div>
      <div>J</div>
    </div>
  </div>
  <div class="indicators__horizontal">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
    <div>10</div>
  </div>
</div>

<style lang="scss">
  .root {
    --cellSize: 35px;

    .row {
      display: flex;

      .cell {
        width: var(--cellSize);
        height: var(--cellSize);
        border: 1px solid black;
        display: flex;

        background-color: #a9a9a9;

        &.clickable {
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }

        &.ship {
          background-color: black;
        }

        &.miss::after,
        &.shot::after {
          color: black;
          font-size: 20px;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 900;
        }

        &.miss::after {
          content: '⦿';
        }

        &.shot::after {
          content: '⦻';
        }

        &.ship.shot::after {
          color: white;
        }
      }
    }

    .indicators {
      &__horizontal {
        display: flex;
        padding-left: var(--cellSize);
        > div {
          height: var(--cellSize);
          width: var(--cellSize);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &__vertical {
        > div {
          height: var(--cellSize);
          width: var(--cellSize);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .board-container {
      display: flex;
    }
  }
</style>
