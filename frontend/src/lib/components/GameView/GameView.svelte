<script lang="ts">
  import type { RoomsWsWithWinner } from '$lib/helpers';
  import { playerStore } from '$lib/stores';
  import type { RoomPlayer } from '$lib/types';
  import Loader from '../Loader/Loader.svelte';
  import MiddleInfoBox from './components/MiddleInfoBox.svelte';
  import PlayerInfo from './components/PlayerInfo.svelte';

  export let client: RoomsWsWithWinner | null;
  export let horizontal = false;
  export let additionalButtonsWhenSat: { content: string; onClick: () => void }[] = [];
  export let disableReady = false;

  $: roomStore = client?.room;
  $: room = $roomStore;

  let me: RoomPlayer | undefined | null;
  $: me = room?.players.find((player) => player && player.nickname === $playerStore?.nickname);
</script>

{#if room}
  <div class="container">
    <div>
      {#if horizontal}
        <div class="horizontal-info">
          <PlayerInfo
            me={$playerStore?.nickname ?? ''}
            leader={room.leader}
            slot={0}
            players={room?.players}
            {client}
          />
          <PlayerInfo
            me={$playerStore?.nickname ?? ''}
            leader={room.leader}
            slot={1}
            players={room?.players}
            {client}
          />
        </div>
        <slot />
      {:else}
        <PlayerInfo
          me={$playerStore?.nickname ?? ''}
          leader={room.leader}
          slot={0}
          players={room?.players}
          {client}
        />
        <slot />
        <PlayerInfo
          me={$playerStore?.nickname ?? ''}
          leader={room.leader}
          slot={1}
          players={room?.players}
          {client}
        />
      {/if}
    </div>
    <MiddleInfoBox {disableReady} me={me ?? null} {room} {client} {additionalButtonsWhenSat} />
  </div>
{:else}
  <Loader show />
{/if}

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;

    .horizontal-info {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
