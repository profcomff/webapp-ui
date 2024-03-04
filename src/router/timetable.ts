import { StudyGroup } from './../api/models/index';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';
import TimetableView from '@/views/timetable/TimetableView.vue';
import { stringifyDate } from '@/utils/date';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';

export const timetableRoutes: RouteRecordRaw[] = [
	{
		path: '',
		redirect: `/timetable/${stringifyDate(new Date())}`
	},
	{
		path: ':date(\\d{2}-\\d{2}-\\d{4})',
		component: TimetableView
	},
	{
		path: 'event/:id(\\d+)',
		component: () => import('../views/timetable/event/TimetableEventView.vue')
	},
	{
		path: 'lecturer/:id(\\d+)',
		component: () => import('../views/timetable/lecturer/TimetableLecturerView.vue')
	},
	{
		path: 'room/:id(\\d+)',
		component: () => import('../views/timetable/room/TimetableRoomView.vue')
	},
	{
		path: 'init',
		component: () => import('../views/timetable/init/TimetableInitView.vue')
	}
];

export const timetableHandler: NavigationGuard = to => {
	const group = LocalStorage.getObject<StudyGroup>(LocalStorageItem.StudyGroup);

	if (to.path !== '/timetable/init' && to.path.startsWith('/timetable') && !group) {
		return { path: '/timetable/init' };
	}

	if (to.path === '/timetable/init' && group) {
		return { path: '/timetable' };
	}
};
