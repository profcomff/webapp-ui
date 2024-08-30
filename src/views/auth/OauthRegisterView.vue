<script setup lang="ts">
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import { useProfileStore } from '@/store/profile';
import { AuthMethodName, UNKNOWN_DEVICE } from '@/models';
import apiClient from '@/api/';

const router = useRouter();
const toolbar = useToolbar();
const profileStore = useProfileStore();

toolbar.setup({
	title: 'Вход',
	backUrl: '/auth',
});

async function handleAccept() {
	try {
		const idToken = sessionStorage.getItem('id-token');
		const idTokenIssuer = sessionStorage.getItem('id-token-issuer') as AuthMethodName;

		if (!idToken || !idTokenIssuer) {
			return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
		}

		const { data } = await apiClient.POST(`/auth/${idTokenIssuer}/registration`, {
			body: {
				id_token: idToken,
				session_name: navigator.userAgent ?? UNKNOWN_DEVICE,
			},
		});
		if (data?.token) {
			localStorage.setItem('token', data.token);
			profileStore.updateToken();
			return router.replace({ path: '/profile' });
		}
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
		<h2>В первый раз в приложении?</h2>
		<p>У вас еще нет аккаунта на этот логин или метод входа.</p>
		<p>
			Если у вас <b>уже есть аккаунт Твой ФФ</b> – нажмите <b>Нет</b> и выберите другой метод входа.
		</p>
		<p>
			Если вы <b>впервые входите в Твой ФФ</b> – нажмите <b>Да</b>. Тогда мы создадим для вас новый
			профиль!
		</p>
		<br />
		<p>Создать новый профиль?</p>
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
