import { scopename } from './../models/ScopeName';
import { marketingApi } from '@/api/marketing';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
	const id = ref<number | null>(null);
	const token = ref<string | null>(null);
	const tokenScopes = ref<string[]>([]);
	const marketingId = ref<number | null>(null);
	const authMethods = ref<string[] | null>(null);

	const groups = ref<number[] | null>(null);
	const indirectGroups = ref<number[] | null>(null);
	const userScopes = ref<string[] | null>(null);
	const sessionScopes = ref<string[] | null>(null);

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
		tokenScopes.value =
			newTokenScopes ?? LocalStorage.getObject<string[]>(LocalStorageItem.TokenScopes) ?? [];
	}

	function deleteToken() {
		LocalStorage.delete(LocalStorageItem.Token, LocalStorageItem.TokenScopes);
		[
			id,
			token,
			tokenScopes,
			authMethods,
			groups,
			indirectGroups,
			userScopes,
			sessionScopes,
		].forEach(i => {
			i.value = null;
		});
	}

	async function updateMarketingId(newMarketingId?: number) {
		const item = LocalStorage.get(LocalStorageItem.MarketingId);
		if (newMarketingId) {
			marketingId.value = newMarketingId;
		} else if (item === null) {
			const { data } = await marketingApi.createUser();
			LocalStorage.set(LocalStorageItem.MarketingId, data.id);
			marketingId.value = data.id;
			marketingApi.writeAction({
				user_id: data.id,
				action: 'user registration',
				additional_data: JSON.stringify(data),
			});
		} else {
			marketingId.value = +item;
		}
	}

	const isUserLogged = computed(() => token.value !== null);

	const isAdmin = computed(() => tokenScopes.value?.includes(scopename.webapp.admin.show));

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
		isUserLogged,
		isAdmin,
		updateMarketingId,
		marketingId,
		id,
		authMethods,
		sessionScopes,
		deleteToken,
	};
});
