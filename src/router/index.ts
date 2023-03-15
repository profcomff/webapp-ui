import { LocalStorage, LocalStorageItem } from './../models/LocalStorage';
import { adminRoutes, adminHandler } from './admin';
import { authRoutes, authHandler } from './auth';
import { AppsView } from '@/views';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { timetableRoutes, timetableHandler } from './timetable';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/timetable',
	},
	{
		path: '/apps',
		component: AppsView,
	},
	{
		path: '/apps/browser',
		component: () => import('../views/apps/browser/AppBrowserView.vue'),
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
		component: () => import('../views/profile/ProfileView.vue'),
	},
	{
		path: '/user/:id(\\d+)',
		component: () => import('../views/user/UserView.vue'),
	},
	{
		path: '/forbidden',
		component: () => import('../views/ViewError403.vue'),
	},
	{
		path: '/:pathMatch(.*)',
		component: () => import('../views/ViewError404.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(to => {
	if (to.path === '/profile' && !LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/auth' };
	}
});
router.beforeEach(timetableHandler);
router.beforeEach(authHandler);
router.beforeEach(adminHandler);

export default router;
