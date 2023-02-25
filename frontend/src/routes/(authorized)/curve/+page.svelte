<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');

		if (!ctx) return;
	});
</script>

<canvas width="500" height="500" bind:this={canvas} />
