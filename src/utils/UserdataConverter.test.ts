import { describe, it, expect } from 'vitest';
import { UserdataConverter } from './UserdataConverter';
import {
	UserdataParamResponseType,
	UserdataRaw,
	UserdataArrayItem,
	UserdataTree,
	UserdataTreeSheet,
} from '@/models';

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
	[
		'street',
		{
			name: 'Моховая',
			is_required: false,
			changeable: true,
			type: UserdataParamResponseType.All,
		},
	],
	[
		'city',
		{
			name: 'Москва',
			is_required: false,
			changeable: true,
			type: UserdataParamResponseType.All,
		},
	],
]);

const expectedObject: UserdataTree = new Map([['Address', treeSheet]]);

const arrayItem: UserdataArrayItem = {
	name: 'Address',
	data: [
		{
			param: 'street',
			value: {
				name: 'Моховая',
				is_required: false,
				changeable: true,
				type: UserdataParamResponseType.All,
			},
		},
		{
			param: 'city',
			value: {
				name: 'Москва',
				is_required: false,
				changeable: true,
				type: UserdataParamResponseType.All,
			},
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
