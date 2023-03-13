import { LocalStorage } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
	const token = ref<string | null>(null);
	const groups = ref<number[]>([]);
	const indirect_groups = ref<number[]>([]);
	const user_scopes = ref<number[]>([]);

	function updateToken(newToken?: string) {
		token.value = newToken ?? LocalStorage.getToken();
	}

	return { token, updateToken };
});
