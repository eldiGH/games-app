<script lang="ts">
  import GamesRankingTable from '$lib/components/GamesRankingTable/GamesRankingTable.svelte';
  import { GameType } from '@prisma/client';
</script>

<GamesRankingTable title="Warcaby" gameType={GameType.CHECKERS} />
