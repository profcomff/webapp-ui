<!-- Страница, которую видит пользователь, когда происходит обработка OAuth редиректа ответа -->
<script setup lang="ts">
import { AuthOauth2BaseApi, oauth2Methods } from '@/api/auth';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { IrdomLayout } from '@/components';
import { isAxiosError } from 'axios';
import { onMounted } from 'vue';
import { useProfileStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
	const authMethod: AuthOauth2BaseApi | undefined = oauth2Methods[router.currentRoute.value.path];
	const profileStore = useProfileStore();
	if (authMethod === undefined) {
		return router.replace({ path: '/auth/error', query: { text: 'Метод авторизации не существует' } });
	}
	if (router.currentRoute.value.hash === '' && Object.keys(router.currentRoute.value.query).length === 0) {
		return router.replace({ path: '/auth/error', query: { text: 'Отсутствуют параметры входа' } });
	}

	try {
		const resp = await (profileStore.isUserLogged
			? authMethod.linkNewAccount(router.currentRoute.value.query)
			: authMethod.login(router.currentRoute.value.query));

		if (resp.status === 200 && resp.data.token) {
			LocalStorage.set(LocalStorageItem.Token, resp.data.token);
			profileStore.updateToken();
			return router.replace({ path: '/profile' });
		}

		return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
	} catch (e) {
		if (!isAxiosError(e)) {
			return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
		}

		if (e.response && e.response.status === 401) {
			const id_token = e.response.data.id_token;

			if (typeof id_token !== 'string') {
				// TODO: Писать в маркетинг об ошибке
				return router.replace({
					path: '/auth/error',
					query: { text: 'Переданы неверные данные для входа' },
				});
			}

			sessionStorage.setItem('id-token', id_token);
			sessionStorage.setItem('id-token-issuer', router.currentRoute.value.path);
			return router.replace({ path: '/auth/register-oauth' });
		}
		if (e.response && e.response.status === 422) {
			return router.replace({ path: '/auth/error', query: { text: 'Выбран неверный аккаунт' } });
		}

		return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
	}
});
</script>

<template>
	<IrdomLayout title="Вход">
		<p>Производим вход в аккаунт...</p>
		<!-- <component
			:is="'script'"
			v-if="router.currentRoute.value.params.name === 'telegram'"
			async="true"
			src="https://telegram.org/js/telegram-widget.js?21"
			:data-telegram-login="telegramBotName"
			data-size="small"
			:data-auth-url="currentPath"
		></component> -->
	</IrdomLayout>
</template>
