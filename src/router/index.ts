import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { authGuard, authRoutes } from './auth';
import { timetableGuard, timetableRoutes } from './timetable';
import { AppsView } from '@/views';
import { adminRoutes } from './admin';
import { marketingGuard } from './guards';
import { profileRoutes } from './profile';

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

router.beforeEach(authGuard);
router.beforeEach(timetableGuard);

router.afterEach(marketingGuard);

export default router;
