<script setup lang="ts">
import { oauth2Methods } from '@/api/auth';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const router = useRouter();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Вход',
	backUrl: '/auth',
});

async function handleAccept() {
	try {
		const idToken = sessionStorage.getItem('id-token');
		const idTokenIssuer = sessionStorage.getItem('id-token-issuer');

		if (!idToken || !idTokenIssuer) {
			return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
		}

		const authMethod = oauth2Methods[idTokenIssuer];

		const response = await authMethod.register({ id_token: idToken });
		if (response.status == 200 && response.data.token) {
			localStorage.setItem('token', response.data.token);
			return router.replace({ path: '/profile' });
		}

		return router.replace({
			path: '/auth/error',
			query: { text: 'Непредвиденная ошибка' },
		});
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == 401) {
			return router.replace({
				path: '/auth/error',
				query: { text: 'Переданы неверные данные для входа' },
			});
		}
	} finally {
		sessionStorage.removeItem('id-token-issuer');
		sessionStorage.removeItem('id-token');
	}
}
</script>

<template>
	<IrdomLayout>
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
