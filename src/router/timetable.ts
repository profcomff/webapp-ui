import { LocalStorage } from '@/models';
import { stringifyDate } from '@/utils';
import { TimetableView } from '@/views';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';

export const timetableRoutes: Array<RouteRecordRaw> = [
	{
		path: '',
		redirect: `/timetable/${stringifyDate(new Date())}`,
	},
	{
		path: ':date(\\d{2}-\\d{2}-\\d{4})',
		component: TimetableView,
	},
	{
		path: 'event/:id(\\d+)',
		component: () => import('../views/timetable/event/TimetableEventView.vue'),
	},
	{
		path: 'lecturer/:id(\\d+)',
		component: () => import('../views/timetable/lecturer/TimetableLecturerView.vue'),
	},
	{
		path: 'room/:id(\\d+)',
		component: () => import('../views/timetable/room/TimetableRoomView.vue'),
	},
	{
		path: 'init',
		component: () => import('../views/timetable/init/TimetableInitView.vue'),
	},
];

export const timetableHandler: NavigationGuard = to => {
	const group = LocalStorage.getStudyGroup();

	if (to.path !== '/timetable/init' && to.path.startsWith('/timetable') && !group) {
		return { path: '/timetable/init' };
	}

	if (to.path === '/timetable/init' && group) {
		return { path: '/timetable' };
	}
};
