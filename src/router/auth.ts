import { AxiosResponse, isAxiosError } from 'axios';
import { AuthOauth2BaseApi, oauth2Methods } from '@/api/auth';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';

export const authRoutes: Array<RouteRecordRaw> = [
	{
		path: '',
		component: () => import('@/views/auth/AuthView.vue'),
	},
	{
		path: 'all',
		component: () => import('@/views/auth/AuthAllView.vue'),
	},
	{
		path: 'register-email',
		component: () => import('@/views/auth/RegisterEmailView.vue'),
	},
	{
		path: 'register-oauth',
		component: () => import('@/views/auth/RegisterOauthView.vue'),
	},
	{
		path: 'error',
		component: () => import('@/views/auth/LoginErrorView.vue'),
	},
];

export const authHandler: NavigationGuard = async to => {
	if (!to.path.startsWith('/auth/oauth-authorized/')) return;

	const authMethod: AuthOauth2BaseApi | undefined = oauth2Methods[to.path];
	if (authMethod === undefined) return;

	try {
		const resp: AxiosResponse = await authMethod.login(to.query);
		if (resp.status === 200 && resp.data.token) {
			localStorage.setItem('token', resp.data.token);
			return { path: '/profile' };
		}
		return { path: '/profile/auth/error', query: { text: 'Непредвиденная ошибка' } };
	} catch (e) {
		if (isAxiosError(e)) {
			if (e.response && e.response.status === 401) {
				const id_token = e.response.data.id_token;
				if (typeof id_token === 'string') {
					sessionStorage.setItem('id-token', id_token);
					sessionStorage.setItem('id-token-issuer', to.path);
					return { path: '/profile/auth/register-oauth' };
				} else {
					// TODO: Писать в маркетинг об ошибке
					return {
						path: '/profile/auth/error',
						query: { text: 'Переданы неверные данные для входа' },
					};
				}
			}
		}
		return { path: '/profile/auth/error', query: { text: 'Непредвиденная ошибка' } };
	}
};
