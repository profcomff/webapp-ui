import { getNameWithInitials } from './personName';
import { describe, expect, it } from 'vitest';

describe('Format person name function: ', () => {
	it('should format full names', () => {
		expect(
			getNameWithInitials({ firstName: 'Artem', lastName: 'Netsvetaev', middleName: 'Andreevich' }),
		).toBe('Netsvetaev A. A.');
	});

	it('should format short names', () => {
		expect(getNameWithInitials({ firstName: 'A.', lastName: 'Netsvetaev', middleName: 'A.' })).toBe(
			'Netsvetaev A. A.',
		);
	});
});
