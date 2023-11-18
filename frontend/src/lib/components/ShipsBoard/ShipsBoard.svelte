<script lang="ts">
  import type { ShipsGameController } from '@shared/gameControllers';
  import type { Ship } from '@shared/types';

  interface BoardData {
    hasShip: boolean;
  }

  const COLS_AND_ROWS_COUNT = 10;
  export let ships: Ship[] = [];

  const getBoardData = (ships: Ship[]) => {
    const board: BoardData[][] = [];

    for (let y = 0; y < 10; y++) {
      const row: BoardData[] = [];
      board.push(row);

      for (let x = 0; x < 10; x++) {
        debugger;
        row.push({ hasShip: !!ships.find((ship) => ship.points.find((point) => point.eq(x, y))) });
      }
    }

    return board;
  };

  $: boardData = getBoardData(ships);

  $: console.log(boardData);
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
      {#each boardData as row}
        <div class="row">
          {#each row as cell}
            <div class="cell" class:ship={cell.hasShip} />
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

        cursor: pointer;

        background-color: #a9a9a9;

        &:hover {
          opacity: 0.8;
        }

        &.ship {
          background-color: black;
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
