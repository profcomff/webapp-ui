import { NavbarItem } from '@/components';

export const navbarItems: NavbarItem[] = [
	{
		icon: 'calendar_month',
		name: 'Расписание',
		path: ['/timetable'],
	},
	{
		icon: 'dashboard',
		name: 'Сервисы',
		path: ['/apps'],
	},
	{
		icon: 'account_circle',
		name: 'Профиль',
		path: ['/profile', '/auth'],
	},
];