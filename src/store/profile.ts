import { LocalStorage, LocalStorageItem } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
	const token = ref<string | null>(null);
	const tokenScopes = ref<string[]>([]);

	const groups = ref<string[] | null>([]);
	const indirectGroups = ref<string[] | null>([]);
	const userScopes = ref<string[] | null>([]);

	function updateToken(newToken?: string) {
		token.value = newToken ?? LocalStorage.get(LocalStorageItem.Token);
	}

	function hasTokenAccess(scopeName: string) {
		return Boolean(tokenScopes.value.includes(scopeName));
	}

	function hasUserAccess(scopeName: string) {
		return Boolean(userScopes.value?.includes(scopeName));
	}

	function updateTokenScopes(newTokenScopes?: string[]) {
		tokenScopes.value = newTokenScopes ?? LocalStorage.getObject<string[]>(LocalStorageItem.TokenScopes) ?? [];
	}

	return {
		token,
		updateToken,
		groups,
		indirectGroups,
		userScopes,
		tokenScopes,
		hasTokenAccess,
		hasUserAccess,
		updateTokenScopes,
	};
});
