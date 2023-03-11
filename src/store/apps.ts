import { AppButtonCategory } from './../api/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<AppButtonCategory[] | null>(null);

	return { categories };
});
