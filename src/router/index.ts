import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { adminRoutes, adminHandler } from './admin';
import { profileRoutes } from './profile';
import { authHandler, authRoutes } from './auth';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { timetableRoutes, timetableHandler } from './timetable';
import AppsView from '@/views/apps/AppsView.vue';
import { useProfileStore } from '@/store/profile';
import { apiClient } from '@/api/';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/timetable',
	},
	{
		path: '/apps',
		component: AppsView,
	},
	{
		path: '/apps/:id(\\d+)',
		component: () => import('@/views/apps/ApplicationFrame.vue'),
		props: route => ({
			id: Number(route.params.id),
			lecturer: route.query.lecturer_id,
			relativePath: route.query.relativePath || '',
		}),
		beforeEnter: route => {
			console.log(route.params, route.query);
		},
	},

	{
		path: '/apps/44/lecturer',
		redirect: to => {
			const query = to.query;
			const relativePath = to.path.slice(to.path.lastIndexOf('/') + 1);

			return {
				path: '/apps/44',
				query: {
					lecturer_id: query.lecturer_id,
					relativePath: relativePath,
				},
			};
		},
	},
	{
		path: '/timetable',
		children: timetableRoutes,
	},
	{
		path: '/auth',
		children: authRoutes,
	},
	{
		path: '/admin',
		children: adminRoutes,
	},
	{
		path: '/profile',
		children: profileRoutes,
	},
	{
		path: '/forbidden',
		component: () => import('@/views/error/Error403View.vue'),
	},
	{
		path: '/:pathMatch(.*)',
		component: () => import('@/views/error/Error404View.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async to => {
	const token = LocalStorage.get(LocalStorageItem.Token);
	const isProfile = to.path.startsWith('/profile');
	const isAuth = to.path.startsWith('/auth');

	if (isProfile && !token) {
		return { path: '/auth' };
	}
	// TODO: Убрать костыль с to.path
	if (
		isAuth &&
		token &&
		to.path !== '/auth/reset/email' &&
		to.path !== '/auth/error' &&
		!to.path.startsWith('/auth/oauth-authorized')
	) {
		return { path: '/profile' };
	}
});
router.beforeEach(timetableHandler);
router.beforeEach(adminHandler);
router.beforeEach(authHandler);

router.afterEach((to, from) => {
	const { marketingId } = useProfileStore();
	if (marketingId) {
		apiClient.POST('/marketing/v1/action', {
			body: {
				action: 'route to',
				path_from: from.fullPath,
				path_to: to.fullPath,
				user_id: marketingId,
			},
		});
	}
});

export default router;
