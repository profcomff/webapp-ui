<script setup lang="ts">
import {
	authPhysicsApi,
	authLkmsuApi,
	authMymsuApi,
	authYandexApi,
	authGoogleApi,
	authVkApi,
	authGithubApi,
	AuthOauth2BaseApi,
} from '@/api/auth';
import { IrdomLayout } from '@/components';

async function openAuthUrl(api: AuthOauth2BaseApi) {
	const url = await api.getAuthUrl();
	window.open(url, '_blank');
}
</script>

<template>
	<IrdomLayout title="Все методы входа" backable back="/profile/auth">
		<form>
			<input type="email" name="email" />
			<input type="password" name="password" />
			<button type="button">Вход</button>
			<RouterLink to="/profile/auth/register-email">Регистрация по электронной почте</RouterLink>
		</form>
		<button type="button" @click="openAuthUrl(authPhysicsApi)" class="link">Войти с почтой @physics.msu.ru</button>
		<button type="button" @click="openAuthUrl(authMymsuApi)" class="link">Войти с почтой @my.msu.ru</button>
		<button type="button" @click="openAuthUrl(authLkmsuApi)" class="link">Войти через ЛК МГУ</button>
		<button type="button" @click="openAuthUrl(authGoogleApi)" class="link">Войти через аккаунт Google</button>
		<button type="button" @click="openAuthUrl(authYandexApi)" class="link">Войти через аккаунт Yandex</button>
		<button type="button" @click="openAuthUrl(authVkApi)" class="link">Войти через аккаунт ВК</button>
		<button type="button" @click="openAuthUrl(authGithubApi)" class="link">Войти через аккаунт Github</button>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
