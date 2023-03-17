<script setup lang="ts">
import { authPhysicsApi } from '@/api/auth';
import { IrdomLayout } from '@/components';

const clickHandler = async () => {
	const url = await authPhysicsApi.getAuthUrl(
		`${import.meta.env.VITE_AUTH_REDIRECT_URL}/auth/oauth-authorized/physics-msu`,
	);
	location.href = url;
};
</script>

<template>
	<IrdomLayout title="Вход" backabble back="/profile">
		<button type="button" @click="clickHandler" class="link">Войти с почтой @physics.msu.ru</button>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
