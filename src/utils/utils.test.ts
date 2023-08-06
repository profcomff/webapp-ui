import { describe, expect, it } from 'vitest';
import { lz } from './utils';

describe('Leading-zero add function:', () => {
	it('should add leading zero to one-digit numbers', () => {
		expect(lz(4)).toBe('04');
	});

	it('should not add leading zero to two-digit numbers', () => {
		expect(lz(10)).toBe('10');
	});
});
