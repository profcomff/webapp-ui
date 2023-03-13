<script setup lang="ts">
import { authPhysicsApi } from '@/api/auth';
import { IrdomLayout } from '@/components';

const clickHandler = async () => {
	const url = await authPhysicsApi.getAuthUrl('http://localhost:9000/auth/oauth-authorized/physics-msu');
	location.href = url;
};
</script>

<template>
	<IrdomLayout title="Вход" back="/profile">
		<button type="button" @click="clickHandler">Войти с почтой @physics.msu.ru</button>
	</IrdomLayout>
</template>

<style scoped></style>
