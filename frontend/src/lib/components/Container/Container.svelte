<div class="container"><div class="container-inner"><slot /></div></div>

<style lang="scss">
	.container {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-grow: 1;

		height: 100%;
		max-height: 100%;

		overflow: auto;

		&-inner {
			padding-top: 50px;
			flex-grow: 1;
		}
	}
</style>
