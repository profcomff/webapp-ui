import { RouteRecordRaw } from 'vue-router';
import { TimetableView } from '@/views';
import { stringifyDate } from '@/utils';

export const timetableRoutes: RouteRecordRaw[] = [
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
		component: () => import('@/views/timetable/event/TimetableEventView.vue'),
	},
	{
		path: 'lecturer/:id(\\d+)',
		component: () => import('@/views/timetable/lecturer/TimetableLecturerView.vue'),
	},
	{
		path: 'room/:id(\\d+)',
		component: () => import('@/views/timetable/room/TimetableRoomView.vue'),
	},
	{
		path: 'init',
		component: () => import('@/views/timetable/init/TimetableInitView.vue'),
	},
];
