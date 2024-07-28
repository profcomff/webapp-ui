import { describe, it, expect } from 'vitest';
import { getWeekdayName, getDateWithDayOffset } from 'src/utils/date';

describe('Convert date functions:', () => {
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
});
