import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Category, AppToken } from '@/models';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<Category[]>([]);
	const appTokens = ref<AppToken[]>([]);

	const addAppToken = (appId: number, token: string | undefined, expire: number) => {
		appTokens.value.push({
			appId,
			token,
			expire,
		});
		LocalStorage.set(LocalStorageItem.AppToken, appTokens.value);
	};

	const checkAppToken = (appId: number) => {
		const appToken = appTokens.value.find(item => item.appId === appId);
		const currentDate = new Date();

		if (!appToken) {
			return undefined;
		} else {
			if (appToken.expire < currentDate.getTime()) {
				appTokens.value.splice(appTokens.value.indexOf(appToken), 1);
				LocalStorage.set(LocalStorageItem.AppToken, appTokens.value);
				return undefined;
			} else {
				return appToken.token;
			}
		}
	};

	const getTokensFromStorage = () => {
		appTokens.value = LocalStorage.getObject(LocalStorageItem.AppToken) ?? [];
	};

	const clearTokensFromStorage = () => {
		LocalStorage.delete(LocalStorageItem.AppToken);
	};

	return {
		categories,
		appTokens,

		addAppToken,
		checkAppToken,
		getTokensFromStorage,
		clearTokensFromStorage,
	};
});
