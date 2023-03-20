<script setup lang="ts">
import { authPhysicsApi, authLkmsuApi, authMymsuApi, AuthOauth2BaseApi } from '@/api/auth';
import { IrdomLayout } from '@/components';

async function openAuthUrl(api: AuthOauth2BaseApi) {
	const url = await api.getAuthUrl();
	window.open(url, '_blank');
}
</script>

<template>
	<IrdomLayout title="Вход" backable back="/profile">
		<button type="button" @click="openAuthUrl(authPhysicsApi)" class="link">Войти с почтой @physics.msu.ru</button>
		<button type="button" @click="openAuthUrl(authMymsuApi)" class="link">Войти с почтой @my.msu.ru</button>
		<button type="button" @click="openAuthUrl(authLkmsuApi)" class="link">Войти через ЛК МГУ</button>
		<RouterLink to="/profile/auth/all">Все способы входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
	margin-bottom: 8px;

	&:last-of-type {
		margin-bottom: 32px;
	}
}
</style>
