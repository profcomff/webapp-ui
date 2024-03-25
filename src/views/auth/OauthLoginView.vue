<!-- Страница, которую видит пользователь, когда происходит обработка OAuth редиректа ответа -->
<script setup lang="ts">
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { isAxiosError } from 'axios';
import { oauth2Methods } from '@/api/auth';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useProfileStore } from '@/store/profile';
import { useToolbar } from '@/store/toolbar';
import { useToastStore } from '@/store/toast';

const router = useRouter();
const route = useRoute();
const toolbar = useToolbar();
const toastStore = useToastStore();
const profileStore = useProfileStore();

toolbar.setup({
	title: 'Вход',
});

onMounted(async () => {
	try {
		const methodName = route.params.method as string;

		if (!(methodName in oauth2Methods)) {
			return router.replace({
				path: '/auth/error',
				query: { text: 'Метод авторизации не существует' },
			});
		}

		const authMethod = oauth2Methods[methodName];

		if (route.hash === '' && Object.keys(route.query).length === 0) {
			return router.replace({
				path: '/auth/error',
				query: { text: 'Отсутствуют параметры входа' },
			});
		}
		const action = profileStore.isUserLogged ? authMethod.linkNewAccount : authMethod.login;
		const response = await action.call(authMethod, route.query);

		if (response.status === 200 && response.data.token) {
			LocalStorage.set(LocalStorageItem.Token, response.data.token);
			profileStore.updateToken();
			toastStore.push({ title: 'Вы успешно вошли в аккаунт' });
			return router.replace({ path: '/profile' });
		}

		return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
	} catch (error) {
		console.log(error);
		if (!isAxiosError(error)) {
			return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
		}

		if (error.response?.status === 401) {
			const id_token = error.response.data.id_token;

			if (typeof id_token !== 'string') {
				// TODO: Писать в маркетинг об ошибке
				return router.replace({
					path: '/auth/error',
					query: { text: 'Переданы неверные данные для входа' },
				});
			}

			sessionStorage.setItem('id-token', id_token);
			sessionStorage.setItem('id-token-issuer', route.path);
			return router.replace({ path: '/auth/register-oauth' });
		}
		if (error.response?.status === 422) {
			return router.replace({ path: '/auth/error', query: { text: 'Выбран неверный аккаунт' } });
		}

		if (error.response?.status === 409) {
			return router.replace({
				path: '/auth/error',
				query: { text: 'Аккаунт с такими данными уже существуют' },
			});
		}

		return router.replace({ path: '/auth/error', query: { text: 'Непредвиденная ошибка' } });
	}
});
</script>

<template>
	<IrdomLayout>
		<p>Производим вход в аккаунт...</p>
	</IrdomLayout>
</template>
