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
		component: () => import('@/views/user/UserView.vue'),
	},
	{
		path: 'edit',
		component: () => import('@/views/profile/ProfileEditView.vue'),
	},
	{
		path: 'edit-auth',
		component: () => import('@/views/profile/ProfileEditAuthView.vue'),
	},
];
