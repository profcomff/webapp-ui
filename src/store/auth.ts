import { Group, Scope, User } from '@/api/models';
import { GroupInfo } from './../api/auth/AuthGroupApi';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface StoreUser extends User {
	groups?: Group[];
	indirectGroups?: Group[];
	scopes?: Scope[];
	deleted: boolean;
}

export interface StoreGroup extends Group {
	scopes: Map<number, Scope>;
	children: Map<number, StoreGroup>;
	parent: StoreGroup | null;
	users: Map<number, StoreUser>;
}

interface SetGroupArgs extends Group {
	[GroupInfo.Scopes]?: Scope[];
	[GroupInfo.Children]?: Group[];
	[GroupInfo.Users]?: User[];
}

interface StoreScope extends Scope {
	deleted: boolean;
}

export const useAuthStore = defineStore('auth', () => {
	const groups = ref<Map<number, StoreGroup>>(new Map());
	const scopes = ref<Map<number, StoreScope>>(new Map());
	const users = ref<Map<number, StoreUser>>(new Map());

	function setGroup(group: SetGroupArgs): void {
		if (!group.child) {
			group.child = [];
		}

		if (!group.scopes) {
			group.scopes = [];
		}

		if (!group.users) {
			group.users = [];
		}

		for (const c of group.child) {
			if (!groups.value.has(c.id)) {
				(c as StoreGroup).children = new Map();
				(c as StoreGroup).scopes = new Map();
				(c as StoreGroup).users = new Map();
				groups.value.set(c.id, c as StoreGroup);
			}
		}

		if (!groups.value.has(group.id)) {
			(group as unknown as StoreGroup).children = new Map();
			(group as unknown as StoreGroup).scopes = new Map(
				group.scopes.map(s => {
					if (!scopes.value.has(s.id)) {
						(s as StoreScope).deleted = false;
						scopes.value.set(s.id, s as StoreScope);
					}
					return [s.id, scopes.value.get(s.id)!];
				}),
			);
			(group as unknown as StoreGroup).parent = null;
			(group as unknown as StoreGroup).users = new Map(
				group.users.map(u => {
					if (!users.value.has(u.id)) {
						(u as StoreUser).deleted = false;
						users.value.set(u.id, u as StoreUser);
					}
					return [u.id, users.value.get(u.id)!];
				}),
			);

			groups.value.set(group.id, group as unknown as StoreGroup);
		} else {
			setGroupScopes(group.id, group.scopes);
			setGroupUsers(group.id, group.users);
		}

		const g = groups.value.get(group.id)!;
		for (const c of group.child) {
			g.children.set(c.id, groups.value.get(c.id)!);
		}

		if (group.parent_id) {
			if (!groups.value.has(group.parent_id)) {
				groups.value.set(group.parent_id, {
					id: group.parent_id,
					name: '',
					parent: null,
					children: new Map(),
					parent_id: null,
					scopes: new Map(),
					users: new Map(),
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
					(s as StoreScope).deleted = false;
					scopes.value.set(s.id, s as StoreScope);
				}

				groups.value.get(groupId)!.scopes.set(s.id, scopes.value.get(s.id)!);
			}
		}
	}

	function setGroupUsers(groupId: number, userList: User[]) {
		if (groups.value.has(groupId)) {
			for (const u of userList) {
				if (!users.value.has(u.id)) {
					(u as StoreUser).deleted = false;
					users.value.set(u.id, u as StoreUser);
				}

				groups.value.get(groupId)!.users.set(u.id, users.value.get(u.id)!);
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
			(scope as StoreScope).deleted = false;
			scopes.value.set(scope.id, scope as StoreScope);
		}
	}

	function setUsers(userList: User[]) {
		for (const user of userList) {
			(user as StoreUser).deleted = false;
			users.value.set(user.id, user as StoreUser);
		}
	}

	function deleteUser(userId: number) {
		if (users.value.has(userId)) {
			users.value.get(userId)!.deleted = true;
		}
	}

	function deleteScope(scopeId: number) {
		if (scopes.value.has(scopeId)) {
			scopes.value.get(scopeId)!.deleted = true;
		}
	}

	return {
		groups,
		scopes,
		users,
		setGroup,
		deleteGroup,
		setScopes,
		setUsers,
		setGroupScopes,
		setGroupUsers,
		setGroupScopeById,
		deleteScope,
		deleteUser,
	};
});
