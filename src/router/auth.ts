import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';
import { useProfileStore } from '@/store/profile';
import { useToastStore } from '@/store/toast';
import { AuthApi } from '@/api';
import { UNKNOWN_DEVICE } from '@/models';

import apiClient from '@/api/';
import { isAuthMethod } from '@/utils/authMethodName';

export const authRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('@/views/auth/AuthView.vue'),
	},
	{
		path: 'reset/password',
		component: () => import('@/views/auth/ResetPassword.vue'),
	},
	{
		path: 'reset/email',
		component: () => import('@/views/auth/ResetEmail.vue'),
	},
	{
		path: 'register-oauth',
		component: () => import('@/views/auth/OauthRegisterView.vue'),
	},
	{
		path: 'error',
		component: () => import('@/views/auth/LoginErrorView.vue'),
	},
	{
		path: 'oauth-authorized/:method([a-z\\-]+)',
		component: () => 'Hello world!',
		name: 'oauth-login',
	},
	{
		path: 'register/success',
		component: () => 'Hello world!',
	},
];

export const authHandler: NavigationGuard = async to => {
	const profileStore = useProfileStore();
	const toastStore = useToastStore();

	if (to.path.startsWith('/auth/oauth-authorized')) {
		const methodName = to.params.method;
		if (!isAuthMethod(methodName)) {
			return {
				path: '/auth/error',
				query: { text: 'Метод авторизации не существует' },
				replace: true,
			};
		}

		if (to.hash === '' && Object.keys(to.query).length === 0) {
			return {
				path: '/auth/error',
				query: { text: 'Отсутствуют параметры входа' },
				replace: true,
			};
		}

		const { data, response } = await apiClient.POST(`/auth/${methodName}/registration`, {
			body: {
				...to.query,
				session_name: navigator.userAgent ?? UNKNOWN_DEVICE,
			},
		});

		console.log(data, response);
		if (response.ok && data?.token) {
			LocalStorage.set(LocalStorageItem.Token, data.token);
			profileStore.updateToken();
			toastStore.push({ title: 'Вы успешно вошли в аккаунт' });
			return { path: '/profile', replace: true };
		} else {
			if (response.status === 401) {
				//Это сработает или можно проще/правильнее?
				const responseBody = await response.json();
				const id_token = responseBody['id_token'];

				if (typeof id_token !== 'string') {
					return {
						path: '/auth/error',
						query: { text: 'Переданы неверные данные для входа' },
						replace: true,
					};
				}

				sessionStorage.setItem('id-token', id_token);
				sessionStorage.setItem('id-token-issuer', methodName);
				return { path: '/auth/register-oauth', replace: true };
			}

			if (response.status === 422) {
				return { path: '/auth/error', query: { text: 'Выбран неверный аккаунт' }, replace: true };
			}

			if (response.status === 409) {
				return {
					path: '/auth/error',
					query: { text: 'Аккаунт с такими данными уже существуют' },
					replace: true,
				};
			}
		}

		return { path: '/auth/error', query: { text: 'Непредвиденная ошибка' }, replace: true };
	}

	if (to.path === '/auth/register/success') {
		const token = to.query.token as string;

		if (token) {
			await AuthApi.approveEmail(token);
		}
		return { path: '/auth', replace: true };
	}
};
