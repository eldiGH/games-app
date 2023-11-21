<script lang="ts">
  import Board from '../Board/Board.svelte';
  import type { WsChessClient } from '$lib/api/wsChess';
  import type { Point } from '@shared/classes';
  import { playerStore } from '$lib/stores';

  export let client: WsChessClient | null;

  $: boardData = client?.boardData;

  $: room = client?.room;

  $: amISecondPlayer = $room?.players[1]?.nickname === $playerStore?.nickname;

  const handleMove = (initialPosition: Point, newPosition: Point) => {
    client?.move({ from: initialPosition.toCoordinates(), to: newPosition.toCoordinates() });
  };

  const handleDragStart = (position: Point) => {
    client?.startDrag(position);
  };

  const handleDragEnd = () => {
    client?.stopDrag();
  };
</script>

<Board
  data={$boardData ?? []}
  onMove={handleMove}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  reversed={amISecondPlayer}
/>
