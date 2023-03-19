<script setup lang="ts">
import { authPhysicsApi, authLkmsuApi, authMymsuApi } from '@/api/auth';
import { IrdomLayout } from '@/components';
</script>

<template>
	<IrdomLayout title="Вход" backable back="/profile">
		<button type="button" @click="authPhysicsApi.openAuthUrl()" class="link">Войти с почтой @physics.msu.ru</button>
		<button type="button" @click="authMymsuApi.openAuthUrl()" class="link">Войти с почтой @my.msu.ru</button>
		<button type="button" @click="authLkmsuApi.openAuthUrl()" class="link">Войти через ЛК МГУ</button>
		<RouterLink to="/profile/auth/all">Другие способы входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
