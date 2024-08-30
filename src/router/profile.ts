import { RouteRecordRaw } from 'vue-router';

export const profileRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('@/views/profile/ProfileView.vue'),
	},
	{
		path: 'sessions',
		component: () => import('@/views/profile/sessions/ProfileSessionsView.vue'),
	},
	{
		path: ':id(\\d+)',
		component: () => import('@/views/profile/ProfileView.vue'),
	},
	// Раскомментируйте, если починили; удалите, если решили дропнуть
	// {
	// 	path: 'edit',
	// 	component: () => import('@/views/profile/ProfileEditView.vue'),
	// },
	{
		path: 'edit-auth',
		component: () => import('@/views/profile/ProfileEditAuthView.vue'),
	},
	{
		path: 'settings',
		component: () => import('@/views/profile/ProfileSettingsView.vue'),
	},
	{
		path: 'change-password',
		component: () => import('@/views/auth/ChangePasswordView.vue'),
	},
	{
		path: 'change-email',
		component: () => import('@/views/auth/ChangeEmailView.vue'),
	},
	{
		path: 'add-email',
		component: () => import('@/views/auth/AddEmailView.vue'),
	},
];
