import { Group } from '@/store/auth';
import { reactive } from 'vue';

export class GroupTreeNode {
	id: number;
	name: string;
	scopes: string[];
	children: GroupTreeNode[] = [];
	parent_id: number | null;

	constructor(parent: Group, children?: Group[]) {
		this.id = parent.id;
		this.name = parent.name;
		this.scopes = parent.scopes;
		this.parent_id = parent.parent_id;

		if (children) {
			for (const child of children) {
				this.children.push(new GroupTreeNode(child));
			}
		}
	}
}

export const convertGroupArrayToTree = (groups: Group[]) => {
	if (groups.length === 0) return null;
	const rootGroup = groups.find(group => group.parent_id === null)!;

	const map = new Map<number, Group>();

	for (const group of groups) {
		map.set(group.id, group);
	}

	const setChildren = (head: GroupTreeNode, ids: number[]) => {
		if (ids.length === 0) return;

		for (const id of ids) {
			const group = map.get(id);
			if (group) {
				const child = new GroupTreeNode(group);
				head.children.push(child);
				setChildren(child, group.children);
			}
		}
	};

	const root: GroupTreeNode = new GroupTreeNode(rootGroup);
	setChildren(root, rootGroup.children);

	return root;
};
