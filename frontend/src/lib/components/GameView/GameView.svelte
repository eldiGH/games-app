<script lang="ts">
  import type { WsCheckersClient } from '$lib/api/wsCheckers';
  import { playerStore } from '$lib/stores';
  import type { Room, RoomPlayer } from '$lib/types';
  import { RoomStatus } from '@shared/types';
  import Card from '@smui/card/src/Card.svelte';
  import Button from '../Button/Button.svelte';
  import Loader from '../Loader/Loader.svelte';
  import PlayerInfo from './components/PlayerInfo.svelte';

  export let room: Room | null | undefined;
  export let client: WsCheckersClient | null;

  let me: RoomPlayer | undefined | null;
  $: me = room?.players.find((player) => player && player.nickname === $playerStore?.nickname);

  const handleReady = () => {
    if (!me) return;

    if (me.isReady) {
      client?.unready();
    } else {
      client?.ready();
    }
  };
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
    {#if room.status !== RoomStatus.Playing}
      <div class="ready-info-box">
        <Card class="card">
          {#if me}
            {#if room.status === RoomStatus.Waiting}
              Oczekiwanie na pozostałych graczy...
            {:else}
              Kliknij,
              {#if me?.isReady}
                aby rozpocząć
              {:else}
                aby anulować
              {/if}
            {/if}
            <div>
              <Button on:click={handleReady} disabled={room.status === RoomStatus.Waiting}>
                {#if me?.isReady}
                  Anuluj
                {:else}
                  Gotowy
                {/if}
              </Button>
            </div>
          {:else}
            Oczekiwanie na rozpoczęcie...
          {/if}
        </Card>
      </div>
    {/if}
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

    .ready-info-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      :global(.card) {
        width: 400px;
        padding: 20px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    }
  }
</style>
