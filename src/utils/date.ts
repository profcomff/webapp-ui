import { lz } from './utils';

export const getWeekdayName = (date: Date, weekday: 'short' | 'long' = 'short') =>
	date.toLocaleString('ru-RU', { weekday });

export const getDateWithDayOffset = (date: Date, offset: number) => {
	const d = new Date(date);
	d.setDate(date.getDate() + offset);

	return d;
};

export const stringifyDate = (date: Date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${year}-${lz(month)}-${lz(day)}`;
};
