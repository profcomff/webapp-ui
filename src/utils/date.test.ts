import { describe, it, expect } from 'vitest';
import { parseDate, stringifyDate, getWeekdayName, getDateWithDayOffset, stringifyDateIso } from './date';

describe('Convert date functions:', () => {
	it('should parse/stringify date by common format dd-mm-yyyy', () => {
		expect(parseDate('01-07-2003')).toEqual(new Date(2003, 6, 1));
		expect(stringifyDate(new Date(2003, 6, 1))).toBe('01-07-2003');

		expect(parseDate(stringifyDate(new Date(2003, 6, 1)))).toEqual(new Date(2003, 6, 1));
		expect(stringifyDate(parseDate('01-07-2003'))).toBe('01-07-2003');
	});

	it('should return correct weekday names', () => {
		expect(getWeekdayName(new Date(2023, 2, 13)).toLowerCase()).toBe('пн');
		expect(getWeekdayName(new Date(2023, 2, 14)).toLowerCase()).toBe('вт');
		expect(getWeekdayName(new Date(2023, 2, 15)).toLowerCase()).toBe('ср');
		expect(getWeekdayName(new Date(2023, 2, 16)).toLowerCase()).toBe('чт');
		expect(getWeekdayName(new Date(2023, 2, 17)).toLowerCase()).toBe('пт');
		expect(getWeekdayName(new Date(2023, 2, 18)).toLowerCase()).toBe('сб');
		expect(getWeekdayName(new Date(2023, 2, 19)).toLowerCase()).toBe('вс');
	});

	it('should correctly change date by offset', () => {
		const date = new Date(2023, 2, 13);
		expect(getDateWithDayOffset(date, 0)).toEqual(date);

		expect(getWeekdayName(getDateWithDayOffset(date, 0))).toBe('пн');
		expect(getWeekdayName(getDateWithDayOffset(date, 1))).toBe('вт');
		expect(getWeekdayName(getDateWithDayOffset(date, 2))).toBe('ср');
		expect(getWeekdayName(getDateWithDayOffset(date, 3))).toBe('чт');
		expect(getWeekdayName(getDateWithDayOffset(date, 4))).toBe('пт');
		expect(getWeekdayName(getDateWithDayOffset(date, 5))).toBe('сб');
		expect(getWeekdayName(getDateWithDayOffset(date, 6))).toBe('вс');
		expect(getWeekdayName(getDateWithDayOffset(date, -1))).toBe('вс');
		expect(getWeekdayName(getDateWithDayOffset(date, -2))).toBe('сб');
		expect(getWeekdayName(getDateWithDayOffset(date, -3))).toBe('пт');
		expect(getWeekdayName(getDateWithDayOffset(date, -4))).toBe('чт');
		expect(getWeekdayName(getDateWithDayOffset(date, -5))).toBe('ср');
		expect(getWeekdayName(getDateWithDayOffset(date, -6))).toBe('вт');
	});

	it('should correct stringify date to ISO format', () => {
		expect(stringifyDateIso(new Date(2023, 2, 13))).toBe('2023-03-13');
	});
});
