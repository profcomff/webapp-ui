import { stringifyDate } from '@/utils';
import { AppsView, TimetableInitView, TimetableView } from '@/views';
import { LocalStorage } from '@/models';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/timetable',
	},
	{
		path: '/timetable',
		redirect: `/timetable/${stringifyDate(new Date())}`,
	},
	{
		path: '/timetable/:date(\\d{2}-\\d{2}-\\d{4})',
		component: TimetableView,
	},
	{
		path: '/timetable/event/:id(\\d+)',
		component: () => import('../views/timetable/event/TimetableEventView.vue'),
	},
	{
		path: '/timetable/lecturer/:id(\\d+)',
		component: () => import('../views/timetable/lecturer/TimetableLecturerView.vue'),
	},
	{
		path: '/timetable/room/:id(\\d+)',
		component: () => import('../views/timetable/room/TimetableRoomView.vue'),
	},
	{
		path: '/timetable/init',
		component: TimetableInitView,
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
		path: '/:pathMatch(.*)',
		component: () => import('../views/View404.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(to => {
	const group = LocalStorage.getGroup();

	if (to.path !== '/timetable/init' && to.path.startsWith('/timetable') && !group) {
		return { path: '/timetable/init' };
	}

	if (to.path === '/timetable/init' && group) {
		return { path: '/timetable' };
	}
});

export default router;
