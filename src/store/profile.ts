import { LocalStorage } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
	const token = ref<string | null>(null);
	const groups = ref<number[]>([]);
	const indirectGroups = ref<number[]>([]);
	const userScopes = ref<number[]>([]);
	const tokenScopes = ref<number[]>([]);

	function updateToken(newToken?: string) {
		token.value = newToken ?? LocalStorage.getToken();
	}

	function hasTokenAccess(scopeId: number) {
		return tokenScopes.value.includes(scopeId);
	}

	function hasUserAccess(scopeId: number) {
		return userScopes.value.includes(scopeId);
	}

	return { token, updateToken, groups, indirectGroups, userScopes, tokenScopes, hasTokenAccess, hasUserAccess };
});
