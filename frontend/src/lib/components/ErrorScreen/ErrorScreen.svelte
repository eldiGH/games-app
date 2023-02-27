<script lang="ts">
	import { globalError } from '$lib/stores';

	const handleRedirect = () => {
		$globalError = false;
	};
</script>

<div class="container">
	<h1>Wystąpił nieoczekiwany błąd</h1>
	<h6>Spróbuj ponownie później</h6>
	<a href="/" on:click={handleRedirect}>Wróć do stroy głównej</a>
</div>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
