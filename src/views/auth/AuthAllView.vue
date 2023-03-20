<script setup lang="ts">
import {
	authPhysicsApi,
	authLkmsuApi,
	authMymsuApi,
	authYandexApi,
	authGoogleApi,
	authVkApi,
	authGithubApi,
} from '@/api/auth';
import { AuthButton, IrdomAuthButton, IrdomLayout } from '@/components';
import logos from '@/assets/logos.svg';
import { IrdomInput, IrdomButton } from '@/components/lib';

const buttons: AuthButton[] = [
	{
		name: 'Войти через ЛК МГУ',
		api: authLkmsuApi,
		icon: `${logos}#msu`,
		color: '#58b4470d',
	},
	{
		name: 'Войти с почтой @physics.msu.ru',
		api: authPhysicsApi,
		icon: `${logos}#ff`,
		color: '#00014c0d',
	},
	{
		name: 'Войти с почтой @my.msu.ru',
		api: authMymsuApi,
		icon: `${logos}#msu`,
		color: '#2f39500d',
	},
	{
		name: 'Войти через аккаунт Yandex',
		api: authYandexApi,
		icon: `${logos}#yandex`,
		color: '#e94c000d',
	},
	{
		name: 'Войти через аккаунт ВК',
		api: authVkApi,
		icon: `${logos}#vk`,
		color: '#0077ff0d',
	},
	{
		name: 'Войти через аккаунт Github',
		api: authGithubApi,
		icon: `${logos}#github`,
		color: '#24292f0d',
	},
	{
		name: 'Войти через аккаунт Google',
		api: authGoogleApi,
		icon: `${logos}#google`,
	},
];
</script>

<template>
	<IrdomLayout title="Все способы входа" backable back="/profile/auth">
		<form>
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

			<RouterLink to="/profile/auth/register-email" class="link">Регистрация по электронной почте</RouterLink>
		</form>

		<div class="buttons">
			<IrdomAuthButton v-for="button of buttons" :key="button.name" :button="button" />
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

form {
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
