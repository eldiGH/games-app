<script lang="ts">
	import { goto } from '$app/navigation';
	import { isAuthed } from '$lib/stores/auth';

	$: if (!$isAuthed) goto('/login');
</script>

<slot />
