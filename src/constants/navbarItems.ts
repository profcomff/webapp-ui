import { NavbarItem } from '@/components/IrdomNavbar.vue';

const profile: NavbarItem = {
	icon: 'account_circle',
	name: 'Профиль',
	path: '/profile',
};

export const navbarItems: Record<string, NavbarItem> = {
	'/timetable': {
		icon: 'calendar_month',
		name: 'Расписание',
		path: '/timetable',
	},
	'/apps': {
		icon: 'dashboard',
		name: 'Сервисы',
		path: '/apps',
	},
	'/profile': profile,
	'/auth': profile,
};
