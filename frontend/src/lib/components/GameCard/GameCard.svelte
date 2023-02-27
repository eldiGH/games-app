<script lang="ts" context="module">
	export interface CardData {
		title: string;
		url: string;
		img: string;
	}
</script>

<script lang="ts">
	import Card from '@smui/card';

	export let data: CardData;
</script>

<div class="container">
	<Card class="card">
		<div class="mdc-typography--headline4 header">{data.title}</div>
		<img src={data.img} alt={data.title} />
	</Card>
</div>

<style lang="scss">
	.container {
		cursor: pointer;
		transition: transform 0.1s ease-in-out;

		:global(.card) {
			padding: 40px;
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
