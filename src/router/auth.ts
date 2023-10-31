import { LocalStorage, LocalStorageItem } from '@/models';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
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
		component: () => import('@/views/auth/EmailRegisterView.vue'),
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
		path: 'oauth-authorized/:name([a-z\\-]+)',
		component: () => import('@/views/auth/OauthLoginView.vue'),
	},
];

export const authHandler: NavigationGuard = to => {
	if (to.path.startsWith('/profile') && !LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/auth' };
	} else if (to.path.startsWith('/auth') && LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/profile' };
	}
};
