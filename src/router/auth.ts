import { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('@/views/auth/AuthView.vue'),
	},
	{
		path: 'register-all',
		component: () => import('@/views/auth/RegisterAllView.vue'),
	},
	{
		path: 'forgot-password',
		component: () => import('@/views/auth/ForgotPassword.vue'),
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
		path: 'oauth-authorized/:method([a-z\\-]+)',
		component: () => import('@/views/auth/OauthLoginView.vue'),
	},
];
