<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card from '@smui/card';
	import Button from '@smui/button';
	import { authStore } from '$lib/stores/auth';
	import { writable } from 'svelte/store';

	let email = '';
	let password = '';

	let error = '';
	$: invalid = !!error;

	const fields = writable({ email: '', password: '' });

	const handleSubmit = async () => {
		const err = await authStore.login({
			email,
			password
		});

		if (!err) return;

		error = err.payload.message;
	};
</script>

<div class="container">
	<Card style="width: 600px">
		<form on:submit={handleSubmit}>
			<div class="card-content">
				<div class="mdc-typography--headline2">Logowanie</div>
				<div>
					<Textfield
						type="email"
						required
						class="text"
						bind:value={$fields.email}
						label="Email"
						name="email"
						bind:invalid
					>
						<HelperText validationMsg slot="helper">{error}</HelperText>
					</Textfield>
				</div>
				<Textfield
					required
					class="text"
					bind:value={$fields.password}
					type="password"
					label="Password"
					name="password"
					bind:invalid
				/>
				<Button type="submit">Login</Button>
			</div>
		</form>
	</Card>
</div>
{$fields.email}
{$fields.password}

<style lang="scss">
	.container {
		.card-content {
			padding: 20px;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			gap: 16px;

			:global(.text) {
				width: 400px;
			}
		}
	}
</style>
