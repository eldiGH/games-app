<script lang="ts">
  import type { WsCheckersClient } from '$lib/api/wsCheckers';
  import Button from '$lib/components/Button/Button.svelte';
  import type { RoomsWsConnect, RoomsWsWithWinner } from '$lib/helpers';
  import type { Room, RoomPlayer } from '$lib/types';
  import { RoomStatus } from '@shared/types';
  import Card from '@smui/card';

  export let me: RoomPlayer | null;
  export let room: Room;
  export let client: RoomsWsWithWinner | null;
  export let additionalButtonsWhenSat: { content: string; onClick: () => void }[] = [];
  export let disableReady: boolean;

  $: winnerIndex = client?.winnerIndex;
  $: isGameFinished =
    $winnerIndex !== null && $winnerIndex !== undefined && room.status === RoomStatus.Full;

  $: {
    console.log({ isGameFinished, winnerIndex: $winnerIndex });
  }

  const getTextContent = (
    room: Room,
    client: RoomsWsWithWinner | null,
    me: RoomPlayer | null
  ): string => {
    if (!client) return '';

    if (isGameFinished) {
      const winner = room.players[$winnerIndex ?? 0];
      return `Gra zakończona, wygrał gracz ${winner?.nickname}`;
    }

    if (me) {
      switch (room.status) {
        case RoomStatus.Waiting:
          return 'Oczekiwanie na pozostałych graczy...';
        case RoomStatus.Full:
          return `Kliknij, aby ${me.isReady ? 'anulować' : 'rozpocząć'}`;
      }
    } else {
      return 'Oczekiwanie na rozpoczęcie...';
    }

    return '';
  };

  const getButtonLabel = (me: RoomPlayer | null): string => (me?.isReady ? 'Anuluj' : 'Gotowy');

  const getIsBoxVisible = (room: Room, client: RoomsWsWithWinner | null): boolean => {
    if (!client) return false;

    return room.status !== RoomStatus.Playing || isGameFinished;
  };

  $: textContent = getTextContent(room, client, me);
  $: buttonLabel = getButtonLabel(me);
  $: isBoxVisible = getIsBoxVisible(room, client);

  const handleReady = () => {
    if (!me || disableReady) return;

    if (me.isReady) {
      client?.unready();
    } else {
      client?.ready();
    }
  };
</script>

{#if isBoxVisible}
  <div class="ready-info-box">
    <Card class="card">
      {textContent}
      <div>
        {#if me}
          <Button
            on:click={handleReady}
            disabled={room.status === RoomStatus.Waiting ||
              (room.status === RoomStatus.Full && disableReady)}
          >
            {buttonLabel}
          </Button>
        {/if}
        {#if me !== null && !me.isReady}
          {#each additionalButtonsWhenSat as additionalButtonWhenSatItem}
            <Button on:click={additionalButtonWhenSatItem.onClick}>
              {additionalButtonWhenSatItem.content}
            </Button>
          {/each}
        {/if}
      </div>
    </Card>
  </div>
{/if}

<style lang="scss">
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
</style>
