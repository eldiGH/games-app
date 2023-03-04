<script lang="ts" context="module">
	export interface CardData {
		title: string;
		url: string;
		img: string;
	}
</script>

<script lang="ts">
	import Card from '@smui/card';
	import Link from '../Link/Link.svelte';

	export let data: CardData;
</script>

<Link href={data.url}>
	<div class="container">
		<Card class="card">
			<div class="mdc-typography--headline4 header">{data.title}</div>
			<img draggable="false" src={data.img} alt={data.title} />
		</Card>
	</div>
</Link>

<style lang="scss">
	@use '@material/card';
	@use '@material/theme/color-palette';

	.container {
		user-select: none;
		cursor: pointer;
		transition: transform 0.1s ease-in-out;
		color: white;

		:global(.card) {
			padding: 40px;

			@include card.fill-color(color-palette.$blue-grey-800);
		}

		.header {
			display: flex;
			justify-content: center;
		}

		img {
			margin-top: 40px;
			width: 400px;
			aspect-ratio: 1/1;
		}

		&:hover {
			transform: scale(1.1);
		}
	}
</style>
