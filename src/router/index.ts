import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { adminHandler, adminRoutes } from './admin';
import { timetableHandler, timetableRoutes } from './timetable';
import { AppsView } from '@/views';
import { authRoutes } from './auth';
import { marketingApi } from '@/api/marketing/MarketingApi';
import { profileRoutes } from './profile';
import { useProfileStore } from '@/store';

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
		path: '/apps/browser',
		component: () => import('@/views/apps/browser/AppBrowserView.vue'),
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

router.beforeEach(to => {
	if (to.path === '/profile' && !LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/auth' };
	} else if (to.path === '/auth' && LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/profile' };
	}
});
router.beforeEach(timetableHandler);
router.beforeEach(adminHandler);

router.afterEach((to, from) => {
	const { marketingId } = useProfileStore();
	if (marketingId) {
		marketingApi.writeAction({
			action: 'route to',
			path_from: from.fullPath,
			path_to: to.fullPath,
			user_id: marketingId,
		});
	}
});

export default router;
