<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import { chessContextKey, type ChessContext } from './+layout.svelte';
  import { goto } from '$app/navigation';
  import RoomsList from '$lib/components/RoomsList/RoomsList.svelte';

  const clientStore = getContext<ChessContext>(chessContextKey);

  let isCreating = false;

  $: {
    $clientStore?.subscribeList();
  }

  $: roomsStore = $clientStore?.roomsList;
  $: rooms = $roomsStore;

  onDestroy(() => {
    $clientStore?.unsubscribeList();
  });

  const handleNewTableClick = async () => {
    const client = $clientStore;
    if (!client) return;

    isCreating = true;
    try {
      const roomId = await client.createRoom();
      goto(`rooms/${roomId}`);
    } finally {
      isCreating = false;
    }
  };

  const handleRoomJoin = async (id: string) => {
    const client = $clientStore;
    if (!client) return;

    goto(`rooms/${id}`);
  };
</script>

<svelte:head>
  <title>GamesApp - Warcaby</title>
</svelte:head>

<RoomsList
  onRoomJoin={handleRoomJoin}
  {isCreating}
  title="Szachy"
  data={rooms ?? null}
  onNewRoomClick={handleNewTableClick}
/>
