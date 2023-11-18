<script lang="ts">
  import Button from '$lib/components/Button/Button.svelte';
  import type { RoomsWsConnect } from '$lib/helpers';
  import type { PlayerWithRating } from '@shared/types';
  import IconButton from '@smui/icon-button';

  export let players: (PlayerWithRating | null)[];
  export let client: RoomsWsConnect | null;
  export let me: string;
  export let leader: string;
  export let slot: number;

  $: player = players[slot];

  $: amILeader = leader === me;
  $: amISittingAnywhere = players.some((player) => player?.nickname === me);
  $: amISittingHere = amISittingAnywhere && player?.nickname === me;

  const handleSit = () => {
    client?.sit(slot);
  };

  const handleKick = () => {
    client?.kick(slot);
  };
</script>

<div class="container">
  {#if player}
    {player.nickname}&nbsp;({player.rating})
    {#if amILeader || amISittingHere}
      <IconButton on:click={handleKick} class="material-icons">block</IconButton>
    {/if}
  {:else}
    <div class="free-spot">
      <Button on:click={handleSit}>
        {#if amISittingAnywhere}
          Przesiądź się
        {:else}
          Usiądź
        {/if}
      </Button>
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    height: 60px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .free-spot {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
