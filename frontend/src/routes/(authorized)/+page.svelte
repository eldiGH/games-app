<script lang="ts">
  import GameCard from '$lib/components/GameCard/GameCard.svelte';
  import type { CardData } from '$lib/components/GameCard/GameCard.svelte';

  const cards: CardData[] = [
    { title: 'Szachy', url: '/chess', img: '/chess.png' },
    { title: 'Warcaby', url: '/checkers', img: '/checkers.png' },
    { title: 'Statki', url: '/chess', img: '/chess.png' },
    { title: 'Kółko i krzyżyk', url: '/chess', img: '/chess.png' },
    { title: 'Saper', url: '/chess', img: '/chess.png' },
    { title: 'Snake', url: '/chess', img: '/chess.png' }
  ];
</script>

<div class="container">
  {#each cards as card}
    <div class="game__card-container">
      <GameCard data={card} />
    </div>
  {/each}
</div>

<style lang="scss">
  .container {
    display: flex;
    padding-bottom: 200px;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 40px 40px;
    gap: 40px;

    @media (max-width: 1670px) {
    }

    @media (max-width: 1100px) {
    }
  }

  .game__card-container {
    flex-basis: 28%;
    display: flex;
    justify-content: center;
  }
</style>
