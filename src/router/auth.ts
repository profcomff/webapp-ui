import { LocalStorage, LocalStorageItem } from '@/models';
import { authPhysicsApi } from '@/api/auth';
import { AxiosError } from 'axios';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';

export const authRoutes: Array<RouteRecordRaw> = [
	{
		path: '',
		component: () => import('../views/auth/AuthView.vue'),
	},
];

async function register({ scopes, id_token }: { scopes: string[]; id_token: string }) {
	try {
		console.log('Try to registrer');
		const {
			data: { token },
		} = await authPhysicsApi.register({ scopes, id_token: id_token });

		return token;
	} catch (e) {
		console.error('Unknown error');
		return null;
	}
}

export const authHandler: NavigationGuard = async to => {
	if (to.path === '/auth/oauth-authorized/physics-msu') {
		const state = to.query.state as string;
		const code = to.query.code as string;
		const scopes: string[] = [];

		try {
			const {
				data: { token },
			} = await authPhysicsApi.login({ state, code, scopes });

			LocalStorage.set<string>(LocalStorageItem.Token, token);

			return { path: '/profile', state: { token } };
		} catch (e) {
			const { response } = e as AxiosError<any>;

			switch (response?.status) {
				case 401:
					if (response.data.id_token) {
						console.log('User has not been registered yet');

						const token = await register({ scopes, id_token: response.data.id_token });
						if (token) {
							LocalStorage.set<string>(LocalStorageItem.Token, token);
						}
						return { path: '/profile', state: { token } };
					} else {
						// ошибка во внешнем сервисе
						break;
					}
				case 409:
					// пользователь уже существует
					break;
			}
		}

		return { path: '/profile' };
	}
};
