import { getNameWithInitials } from './personName';
import { describe, expect, it } from 'vitest';

describe('Format person name function: ', () => {
	it('should format full names', () => {
		expect(
			getNameWithInitials({
				first_name: 'Artem',
				last_name: 'Netsvetaev',
				middle_name: 'Andreevich',
			})
		).toBe('Netsvetaev A. A.');
	});

	it('should format short names', () => {
		expect(
			getNameWithInitials({ first_name: 'A.', last_name: 'Netsvetaev', middle_name: 'A.' })
		).toBe('Netsvetaev A. A.');
	});
});
