<script setup lang="ts">
import { oauth2Methods } from '@/api/auth';
import { useRouter } from 'vue-router';
import { IrdomLayout } from '@/components';
import { AxiosResponse, isAxiosError } from 'axios';

const router = useRouter();

async function handleAccept() {
	const authMethod = oauth2Methods[sessionStorage.getItem('id-token-issuer') || ''];
	const idToken = sessionStorage.getItem('id-token');
	sessionStorage.removeItem('id-token-issuer');
	sessionStorage.removeItem('id-token');

	if (authMethod === undefined || idToken === null) {
		router.push({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
		return;
	}
	try {
		const resp: AxiosResponse = await authMethod.register({ id_token: idToken });
		if (resp.status == 200 && resp.data.token) {
			localStorage.setItem('token', resp.data.token);
			router.push({ path: '/profile' });
		}
	} catch (e) {
		if (isAxiosError(e)) {
			if (e.response && e.response.status == 401) {
				return {
					path: '/auth/error',
					query: { text: 'Переданы неверные данные для входа' },
				};
			}
		}
	}
}
</script>

<template>
	<IrdomLayout title="Вход" backable back="/auth">
		<p>Вы еще не совершали вход в приложение с этим аккаунтом. Создать новый профиль?</p>
		<button @click="handleAccept()">Да</button>
		<RouterLink to="/auth" class="link">Нет</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
