import { lz } from './utils';

export const getWeekdayName = (date: Date, weekday: 'short' | 'long' = 'short') =>
	date.toLocaleString('ru-RU', { weekday });

export const getDateWithDayOffset = (date: Date, offset: number) => {
	const d = new Date(date);
	d.setDate(date.getDate() + offset);

	return d;
};

export const parseDate = (value: string) => {
	const [day, month, year] = value.split('-').map(v => Number(v));
	return new Date(year, month - 1, day);
};

export const stringifyDate = (date: Date) => {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return `${lz(day)}-${lz(month + 1)}-${year}`;
};

export const stringifyDateIso = (date: Date) => {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return `${year}-${lz(month + 1)}-${lz(day)}`;
};
