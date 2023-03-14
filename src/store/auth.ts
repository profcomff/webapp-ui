import { Group, Scope } from './../api/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface AuthGroup extends Group {
	scopes: Map<number, Scope>;
	children: Map<number, AuthGroup>;
	parent: AuthGroup | null;
}

export interface SetGroupArgs extends Group {
	scopes?: Scope[];
	child?: Group[];
}

export const useAuthStore = defineStore('auth', () => {
	const groups = ref<Map<number, AuthGroup>>(new Map());
	const scopes = ref<Map<number, Scope>>(new Map());

	function setGroup(group: SetGroupArgs): void {
		if (!group.child) {
			group.child = [];
		}

		if (!group.scopes) {
			group.scopes = [];
		}

		for (const c of group.child) {
			if (!groups.value.has(c.id)) {
				(c as AuthGroup).children = new Map();
				(c as AuthGroup).scopes = new Map();
				groups.value.set(c.id, c as AuthGroup);
			}
		}

		if (!groups.value.has(group.id)) {
			(group as unknown as AuthGroup).children = new Map();
			(group as unknown as AuthGroup).scopes = new Map();
			(group as unknown as AuthGroup).parent = null;
			groups.value.set(group.id, group as unknown as AuthGroup);
		}

		const g = groups.value.get(group.id)!;
		for (const c of group.child) {
			g.children.set(c.id, groups.value.get(c.id)!);
		}

		setGroupScopes(group.id, group.scopes);

		if (group.parent_id) {
			if (!groups.value.has(group.parent_id)) {
				groups.value.set(group.parent_id, {
					id: group.parent_id,
					name: '',
					parent: null,
					children: new Map(),
					parent_id: null,
					scopes: new Map(),
				});
			}

			const parent = groups.value.get(group.parent_id)!;
			parent.children.set(g.id, g);
			g.parent = parent;
			g.parent_id = group.parent_id;
		}
	}

	function setGroupScopes(groupId: number, scopeList: Scope[]) {
		if (groups.value.has(groupId)) {
			for (const s of scopeList) {
				if (!scopes.value.has(s.id)) {
					scopes.value.set(s.id, s);
				}

				groups.value.get(groupId)!.scopes.set(s.id, scopes.value.get(s.id)!);
			}
		}
	}

	function setGroupScopeById(groupId: number, scopeId: number) {
		if (groups.value.has(groupId) && scopes.value.has(scopeId)) {
			groups.value.get(groupId)!.scopes.set(scopeId, scopes.value.get(scopeId)!);
		}
	}

	function deleteGroup(groupId: number) {
		const group = groups.value.get(groupId);
		if (group) {
			if (group.parent) {
				for (const child of group.children.values()) {
					child.parent = group.parent;
					child.parent_id = group.parent_id;
					group.parent.children.set(child.id, child);
				}
				group.parent.children.delete(groupId);
				groups.value.delete(groupId);
			} else {
				throw new Error('Нельзя удалить группу root');
			}
		}
	}

	function setScopes(scopesList: Scope[]): void {
		for (const scope of scopesList) {
			scopes.value.set(scope.id, scope);
		}
	}

	function deleteScope() {}

	return { groups, scopes, setGroup, deleteGroup, setScopes, deleteScope, setGroupScopeById };
});
