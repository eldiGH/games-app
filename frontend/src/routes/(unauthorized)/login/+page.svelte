<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card from '@smui/card';
	import Button from '@smui/button';
	import { authStore } from '$lib/stores/auth';
	import { createForm } from 'svelte-forms-lib';
	import { loginRequestSchema } from '@shared/schemas';
	import { notificationStore } from '$lib/stores';

	const { form, errors, handleChange, handleSubmit, touched } = createForm({
		initialValues: { email: '', password: '' },
		validationSchema: loginRequestSchema,
		onSubmit: async (values) => {
			console.log(values);
			const error = await authStore.login(values);

			if (!error) {
				notificationStore.push({ type: 'success', message: 'Zalogowano pomyślnie' });
				return;
			}

			$errors.email = error.payload.message;
		}
	});
</script>

<div class="container">
	<Card style="width: 600px">
		<form on:submit={handleSubmit}>
			<div class="card-content">
				<div class="mdc-typography--headline2">Logowanie</div>
				<div>
					<Textfield
						class="text"
						bind:value={$form.email}
						label="Email"
						name="email"
						invalid={!!$errors.email}
						on:change={handleChange}
					>
						<HelperText validationMsg slot="helper">{$errors.email}</HelperText>
					</Textfield>
				</div>
				<div>
					<Textfield
						class="text"
						bind:value={$form.password}
						type="password"
						label="Password"
						name="password"
						invalid={!!$errors.password}
						on:change={handleChange}
					>
						<HelperText validationMsg slot="helper">{$errors.password}</HelperText>
					</Textfield>
				</div>
				<Button type="submit">Login</Button>
			</div>
		</form>
	</Card>
</div>

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
