<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card from '@smui/card';
	import { registerRequestFormSchema, type RegisterRequestForm } from '@shared/schemas';
	import { t } from 'svelte-i18n';
	import { createForm } from '$lib/stores/form';
	import { registerRequest } from '$lib/api';
	import { goto } from '$app/navigation';
	import { notificationStore } from '$lib/stores';
	import { ApiErrorCode } from '@shared/types';
	import Link from '$lib/components/Link/Link.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	const { errors, submit, touched, handleBlur, isSubmitting, isValid, values } = createForm(
		{ email: '', password: '', passwordRepeat: '', nickname: '' },
		registerRequestFormSchema
	);

	const handleSubmit = async (values: RegisterRequestForm) => {
		const { error } = await registerRequest(values);

		if (!error) {
			notificationStore.pushSuccess('Zarejestrowano pomyślnie');
			goto('/login');
			return;
		}

		switch (error.payload.errorCode) {
			case ApiErrorCode.EMAIL_ALREADY_IN_USE:
				$errors.email = 'Istnieje już konto z tym adresem email';
				return;
			case ApiErrorCode.EMAIL_AND_NICKNAME_ALREADY_IN_USE:
				$errors.email = 'Istnieje już konto z tym adresem email';
				$errors.nickname = 'Ten nick jest już zajęty';
				return;
			case ApiErrorCode.NICKNAME_ALREADY_IN_USE: {
				$errors.nickname = 'Ten nick jest już zajęty';
			}
		}

		notificationStore.pushError(error.payload.message);
	};
</script>

<svelte:head>
	<title>GamesApp - Rejestracja</title>
</svelte:head>

<div class="container">
	<Card class="card">
		<form on:submit={submit(handleSubmit)} autocomplete="on">
			<div class="card-content">
				<div class="mdc-typography--headline2">Rejestracja</div>
				<div>
					<Textfield
						autocomplete="username"
						class="text"
						bind:value={$values.nickname}
						label="Nick*"
						name="nickname"
						invalid={$touched.nickname && !!$errors.nickname}
						on:blur={handleBlur}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.nickname && $t($errors.nickname)}</HelperText
						>
					</Textfield>
				</div>
				<div>
					<Textfield
						autocomplete="email"
						class="text"
						bind:value={$values.email}
						label="Email*"
						name="email"
						invalid={$touched.email && !!$errors.email}
						on:blur={handleBlur}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.email && $t($errors.email)}</HelperText
						>
					</Textfield>
				</div>
				<div>
					<Textfield
						autocomplete="new-password"
						class="text"
						bind:value={$values.password}
						type="password"
						label="Hasło*"
						name="password"
						invalid={$touched.password && !!$errors.password}
						on:blur={handleBlur}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.password && $t($errors.password)}</HelperText
						>
					</Textfield>
				</div>
				<div>
					<Textfield
						autocomplete="new-password"
						class="text"
						bind:value={$values.passwordRepeat}
						type="password"
						label="Powtórz hasło*"
						name="passwordRepeat"
						invalid={$touched.passwordRepeat && !!$errors.passwordRepeat}
						on:blur={handleBlur}
					>
						<HelperText validationMsg slot="helper"
							>{$touched.passwordRepeat && $t($errors.passwordRepeat)}</HelperText
						>
					</Textfield>
				</div>
				<Button loading={$isSubmitting} disabled={!$isValid} type="submit">Zarejestruj się</Button>
				<Link disabled={$isSubmitting} href="/login">Logowanie</Link>
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
