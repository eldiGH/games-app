<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card from '@smui/card';
	import { authStore } from '$lib/stores/auth';
	import { loginRequestSchema, type LoginRequest } from '@shared/schemas';
	import { notificationStore } from '$lib/stores';
	import { t } from 'svelte-i18n';
	import { ApiErrorCode } from '@shared/types';
	import { createForm } from '$lib/stores/form';
	import Link from '$lib/components/Link/Link.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	const { values, errors, isSubmitting, submit, isValid, touched, handleBlur } = createForm(
		{ email: '', password: '' },
		loginRequestSchema
	);

	const handleSubmit = async (values: LoginRequest) => {
		const error = await authStore.login(values);

		if (!error) {
			notificationStore.pushSuccess('Zalogowano pomyślnie');
			return;
		}

		if (error.payload.errorCode === ApiErrorCode.EMAIL_OR_PASSWORD_NOT_VALID)
			$errors.email = 'Email lub hasło są nieprawidłowe';
		else notificationStore.pushError(error.payload.message);
	};
</script>

<svelte:head>
	<title>GamesApp - Logowanie</title>
</svelte:head>

<div class="container">
	<Card class="card">
		<form on:submit={submit(handleSubmit)}>
			<div class="card-content">
				<div class="mdc-typography--headline2">Logowanie</div>
				<div>
					<Textfield
						class="text"
						bind:value={$values.email}
						on:blur={handleBlur}
						label="Email*"
						name="email"
						invalid={$touched.email && !!$errors.email}
						disabled={$isSubmitting}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.email && $t($errors.email)}</HelperText
						>
					</Textfield>
				</div>
				<div>
					<Textfield
						class="text"
						bind:value={$values.password}
						on:blur={handleBlur}
						type="password"
						label="Hasło*"
						name="password"
						invalid={$touched.email && !!$errors.password}
						disabled={$isSubmitting}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.email && $t($errors.password)}</HelperText
						>
					</Textfield>
				</div>
				<Button loading={$isSubmitting} disabled={!$isValid} type="submit">Zaloguj</Button>
				<Link disabled={$isSubmitting} href="/register">Rejestracja</Link>
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

			:global(.card) {
				width: 600px;
				position: relative;
			}
		}
	}
</style>
