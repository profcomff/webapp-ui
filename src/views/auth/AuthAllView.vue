<script setup lang="ts">
import { IrdomAuthButton, IrdomLayout } from '@/components';
import { IrdomInput, IrdomButton } from '@/components/lib';
import { authButtons } from '@/constants';
</script>

<template>
	<IrdomLayout title="Все способы входа" backable back="/auth">
		<form class="form">
			<IrdomInput
				type="email"
				name="email"
				autocomplete="email"
				placeholder="Введите почту"
				class="animate__animated animate__fadeInLeft input"
			/>
			<IrdomInput
				type="password"
				name="password"
				autocomplete="current-password"
				placeholder="Введите пароль"
				class="animate__animated animate__fadeInLeft input"
			/>
			<IrdomButton type="submit" class="animate__animated animate__headShake submit">Вход</IrdomButton>

			<RouterLink to="/auth/register-email" class="link">Регистрация по электронной почте</RouterLink>
		</form>

		<div class="buttons">
			<IrdomAuthButton v-for="button of authButtons" :key="button.name" :button="button" />
		</div>
	</IrdomLayout>
</template>

<style scoped>
.link {
	width: fit-content;
	display: block;
	margin: 0 auto 64px;
}

.input {
	align-self: center;
	width: 100%;
	max-width: 400px;
	margin: 0 auto 24px;
	animation-duration: 0.3s;
}

.input:nth-child(2) {
	animation-delay: 0.1s;
}

.form {
	display: flex;
	flex-direction: column;
	align-items: center;

	@media screen and (width <= 575px) {
		margin-top: 50%;
	}
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.submit {
	width: 100%;
	max-width: 400px;
	align-self: center;
	background: var(--color-primary);
	color: white;
	margin: 0 auto 16px;
}
</style>
