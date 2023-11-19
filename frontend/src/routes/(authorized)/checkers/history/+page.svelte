<script lang="ts">
  import GamesHistoryTable from '$lib/components/GamesHistoryTable/GamesHistoryTable.svelte';
  import { GameType } from '@prisma/client';
</script>

<GamesHistoryTable title="Warcaby" gameType={GameType.CHECKERS} />
