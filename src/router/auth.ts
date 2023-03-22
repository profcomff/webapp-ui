import { RouteRecordRaw } from 'vue-router';

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
