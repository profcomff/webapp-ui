import { Group, Scope } from '@/api/models';
import { LocalStorage, LocalStorageItem } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
	const token = ref<string | null>(null);
	const groups = ref<Group[]>([]);
	const indirectGroups = ref<Group[]>([]);
	const userScopes = ref<Scope[]>([]);
	const tokenScopes = ref<Scope[]>([]);

	function updateToken(newToken?: string) {
		token.value = newToken ?? LocalStorage.get(LocalStorageItem.Token);
	}

	function hasTokenAccess(scopeId: number) {
		return Boolean(tokenScopes.value.find(({ id }) => id === scopeId));
	}

	function hasUserAccess(scopeId: number) {
		return Boolean(userScopes.value.find(({ id }) => id === scopeId));
	}

	function updateTokenScopes(newTokenScopes?: Scope[]) {
		tokenScopes.value = newTokenScopes ?? LocalStorage.getObject<Scope[]>(LocalStorageItem.TokenScopes) ?? [];
	}

	return { token, updateToken, groups, indirectGroups, userScopes, tokenScopes, hasTokenAccess, hasUserAccess };
});
