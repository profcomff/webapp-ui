import { RouteRecordRaw } from 'vue-router';

export const profileRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('@/views/profile/ProfileView.vue'),
	},
	{
		path: ':id(\\d+)',
		component: () => import('@/views/user/UserView.vue'),
	},
];
