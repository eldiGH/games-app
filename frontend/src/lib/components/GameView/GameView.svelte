<script lang="ts">
  import type { WsCheckersClient } from '$lib/api/wsCheckers';
  import { playerStore } from '$lib/stores';
  import type { Room, RoomPlayer } from '$lib/types';
  import Loader from '../Loader/Loader.svelte';
  import MiddleInfoBox from './components/MiddleInfoBox.svelte';
  import PlayerInfo from './components/PlayerInfo.svelte';

  export let room: Room | null | undefined;
  export let client: WsCheckersClient | null;

  let me: RoomPlayer | undefined | null;
  $: me = room?.players.find((player) => player && player.nickname === $playerStore?.nickname);
</script>

{#if room}
  <div class="container">
    <div>
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
    </div>
    <MiddleInfoBox me={me ?? null} {room} {client} />
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
  }
</style>
