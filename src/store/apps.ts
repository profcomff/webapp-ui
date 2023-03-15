import { Category } from '@/api/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<Category[] | null>(null);

	return { categories };
});
