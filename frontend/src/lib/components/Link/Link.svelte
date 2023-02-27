<script lang="ts">
	export let href: string;
	export let disabled = false;
</script>

<a class:disabled {href}><slot /></a>

<style lang="scss">
	a {
		font-weight: bold;
		text-decoration: none;
		color: #1e90ff;
		transition: color 0.1s ease-in-out;

		&:hover {
			color: #1560bd;
		}

		&.disabled {
			pointer-events: none;
			color: gray;

			&:hover {
				color: gray;
			}
		}
	}
</style>
