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
		const methodLink = to.params.method;
		if (!isAuthMethod(methodLink)) {
			return {
				path: '/auth/error',
				query: { text: 'Метод авторизации не существует', from: 'oauth' },
				replace: true,
			};
		}

		if (to.hash === '' && Object.keys(to.query).length === 0) {
			return {
				path: '/auth/error',
				query: { text: 'Отсутствуют параметры входа', from: 'oauth' },
				replace: true,
			};
		}

		const { data, response } = profileStore.isUserLogged
			? await apiClient.POST(`/auth/${methodLink}/login`, { body: { ...to.query } })
			: await apiClient.POST(`/auth/${methodLink}/registration`, {
					body: {
						...to.query,
						session_name: navigator.userAgent ?? UNKNOWN_DEVICE,
					},
				});

		if (response.ok && data?.token) {
			LocalStorage.set(LocalStorageItem.Token, data.token);
			profileStore.updateToken();
			toastStore.push({ title: 'Вы успешно вошли в аккаунт' });
			return { path: '/profile', replace: true };
		} else {
			if (response.status === 401) {
				const id_token = data?.token;

				if (typeof id_token !== 'string') {
					return {
						path: '/auth/error',
						query: { text: 'Переданы неверные данные для входа', from: 'oauth' },
						replace: true,
					};
				}

				sessionStorage.setItem('id-token', id_token);
				sessionStorage.setItem('id-token-issuer', methodLink);
				return { path: '/auth/register-oauth', replace: true };
			}

			if (response.status === 422) {
				return {
					path: '/auth/error',
					query: { text: 'Выбран неверный аккаунт', from: 'oauth' },
					replace: true,
				};
			}

			if (response.status === 409) {
				return {
					path: '/auth/error',
					query: { text: 'Аккаунт с такими данными уже существуют', from: 'oauth' },
					replace: true,
				};
			}
		}

		return {
			path: '/auth/error',
			query: { text: 'Непредвиденная ошибка', from: 'oauth' },
			replace: true,
		};
	}

	if (to.path === '/auth/register/success') {
		const token = to.query.token as string;

		if (token) {
			await AuthApi.approveEmail(token);
		}
		return { path: '/auth', replace: true };
	}
};
