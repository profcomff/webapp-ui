<script setup lang="ts">
import { oauth2Methods } from '@/api/auth';
import { useRouter } from 'vue-router';
import { AxiosResponse, isAxiosError } from 'axios';
import IrdomLayout from '@/components/IrdomLayout.vue';

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
		<div class="btns">
			<v-btn type="button" class="no" @click="router.push('/auth')">Нет</v-btn>
			<v-btn type="button" class="yes" @click="handleAccept">Да</v-btn>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.btns {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 20px;
	gap: 8px;

	& button {
		width: min(128px, 100%);
	}
}

.no {
	--background: oklch(62.8% 0.26 29.23deg / 8%);
}

.yes {
	--background: oklch(86.64% 0.29 142.5deg / 8%);
}
</style>
