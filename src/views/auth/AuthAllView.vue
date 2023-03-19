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
import { IrdomLayout } from '@/components';
</script>

<template>
	<IrdomLayout title="Все методы входа" backable back="/profile/auth">
		<form>
			<input type="email" name="email" />
			<input type="password" name="password" />
			<button type="button">Вход</button>
			<RouterLink to="/profile/auth/register-email">Регистрация по электронной почте</RouterLink>
		</form>
		<button type="button" @click="authPhysicsApi.openAuthUrl()" class="link">Войти с почтой @physics.msu.ru</button>
		<button type="button" @click="authMymsuApi.openAuthUrl()" class="link">Войти с почтой @my.msu.ru</button>
		<button type="button" @click="authLkmsuApi.openAuthUrl()" class="link">Войти через ЛК МГУ</button>
		<button type="button" @click="authGoogleApi.openAuthUrl()" class="link">Войти через аккаунт Google</button>
		<button type="button" @click="authYandexApi.openAuthUrl()" class="link">Войти через аккаунт Yandex</button>
		<!-- <button type="button" @click="clickHandler()" class="link">Войти через аккаунт Telegram</button> -->
		<button type="button" @click="authVkApi.openAuthUrl()" class="link">Войти через аккаунт ВК</button>
		<button type="button" @click="authGithubApi.openAuthUrl()" class="link">Войти через аккаунт Github</button>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
