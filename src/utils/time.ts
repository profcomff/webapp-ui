import { lz } from './utils';

export const formatTime = (ts: number | string) => {
	const date = new Date(ts);
	return `${lz(date.getHours())}:${lz(date.getMinutes())}`;
};

export const msInHour = 60 * 60 * 1000;
