import { GroupTreeNode } from './../utils/groupsTree';
import { AuthGroup, Scope } from './../api/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Group extends AuthGroup {
	scopes: number[];
	children: number[];
}

export const useAuthStore = defineStore('auth', () => {
	const groups = ref<Map<number, Group>>(new Map());
	const scopes = ref<Map<number, Scope>>(new Map());
	const groupsTree = ref<GroupTreeNode | null>(null);

	function getScopes(ids: number[]) {
		const arr: Scope[] = [];
		for (const id of ids) {
			const scope = scopes.value.get(id);
			if (scope) {
				arr.push(scope);
			}
		}
		return arr.length ? arr : null;
	}

	function addGroup(group: Group) {
		groups.value.set(group.id, group);

		const updateTree = (head: GroupTreeNode) => {
			if (head.id === group.parent_id) {
				head.children.push(new GroupTreeNode(group));
				return;
			}
			for (const child of head.children) {
				updateTree(child);
			}
		};
		if (groupsTree.value) {
			updateTree(groupsTree.value);
		}
	}

	function removeGroup({ id, parent_id }: { id: number; name: string; parent_id: number }) {
		groups.value.delete(id);

		const updateTree = (head: GroupTreeNode) => {
			if (head.id === parent_id) {
				const child = head.children.find(c => c.id === id);
				if (child) {
					child.children.forEach(c => (c.parent_id = head.id));
					head.children = head.children.filter(({ id }) => id !== child.id).concat(child.children);
					return;
				}
			}
			for (const child of head.children) {
				updateTree(child);
			}
		};

		if (groupsTree.value) {
			updateTree(groupsTree.value);
		}
	}

	return { groups, scopes, getScopes, addGroup, groupsTree, removeGroup };
});
