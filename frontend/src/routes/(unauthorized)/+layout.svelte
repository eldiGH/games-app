<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/Container/Container.svelte';
	import { isAuthed } from '$lib/stores/auth';

	$: if ($isAuthed) goto('/');
</script>

<Container>
	<slot />
</Container>
