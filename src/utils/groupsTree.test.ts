import { Group } from '@/store/auth';
import { GroupTreeNode, convertGroupArrayToTree } from './groupsTree';
import { describe, it, expect } from 'vitest';

const arr1: Group[] = [
	{ id: 1, name: 'root', parent_id: null, children: [2, 3], scopes: [] },
	{ id: 2, name: 'student', parent_id: 1, children: [], scopes: [] },
	{ id: 3, name: 'lecturer', parent_id: 1, children: [], scopes: [] },
];

const res1: GroupTreeNode = {
	id: 1,
	name: 'root',
	scopes: [],
	children: [
		{ id: 2, name: 'student', children: [], scopes: [], parent_id: 1 },
		{ id: 3, name: 'lecturer', children: [], scopes: [], parent_id: 1 },
	],
	parent_id: null,
};

describe('Convert array of groups to tree test', () => {
	it('Should return null if there is no groups', () => {
		expect(convertGroupArrayToTree([])).toEqual(null);
	});

	it('Should correctly convert arrays', () => {
		expect(convertGroupArrayToTree(arr1)).toEqual(res1);
	});
});
