import { UserdataRaw } from '@/api/models';
import { describe, it, expect } from 'vitest';
import { UserdataConverter } from './UserdataConverter';
import { UserdataArrayItem, UserdataTree, UserdataTreeSheet } from '@/models';

const flatResposne: UserdataRaw = {
	items: [
		{
			category: 'Address',
			param: 'street',
			value: 'Моховая',
		},
		{
			category: 'Address',
			param: 'city',
			value: 'Москва',
		},
	],
};

const treeSheet: UserdataTreeSheet = new Map([
	['street', 'Моховая'],
	['city', 'Москва'],
]);

const expectedObject: UserdataTree = new Map([['Address', treeSheet]]);

const arrayItem: UserdataArrayItem = {
	name: 'Address',
	data: [
		{
			param: 'street',
			value: 'Моховая',
		},
		{
			param: 'city',
			value: 'Москва',
		},
	],
};

describe('Userdata converter:', () => {
	it('should convert a flat api response to a deep object', () => {
		expect(UserdataConverter.flatToTree(flatResposne)).toEqual(expectedObject);
	});

	it('should convert a tree sheet to an array item', () => {
		expect(UserdataConverter.sheetToItem('Address', treeSheet)).toEqual(arrayItem);
	});
});
