<script lang="ts">
  import type { WsCheckersClient } from '$lib/api/wsCheckers';
  import type { Point } from '@shared/classes';
  import Board, { type BoardData, type BoardItem } from '../Board/Board.svelte';

  export let client: WsCheckersClient | null;
  $: boardDataStore = client?.boardData;
  $: boardData = $boardDataStore ?? [];

  const handleMove = (initialPosition: Point, newPosition: Point) => {
    if (!client?.move({ from: initialPosition.toCoordinates(), to: newPosition.toCoordinates() }))
      return;
  };

  const handleDragStart = (position: Point) => {
    client?.startDrag(position);
  };

  const handleDragEnd = () => {
    client?.stopDrag();
  };
</script>

<Board
  data={boardData}
  onMove={handleMove}
  onDragEnd={handleDragEnd}
  onDragStart={handleDragStart}
/>
