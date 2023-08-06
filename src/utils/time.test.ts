import { describe, expect, it } from 'vitest';
import { formatTime } from './time';

describe('Time format function:', () => {
	it('should format timestamp to hh:mm', () => {
		expect(formatTime(new Date(2023, 13, 2, 0, 0).getTime())).toBe('00:00');
		expect(formatTime(new Date(2023, 13, 2, 13, 29).getTime())).toBe('13:29');
		expect(formatTime(new Date(2023, 13, 2, 23, 59).getTime())).toBe('23:59');
		expect(formatTime(new Date(2023, 13, 2, 24, 0).getTime())).toBe('00:00');
	});
});
