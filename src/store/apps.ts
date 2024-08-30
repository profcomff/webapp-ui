import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Category } from '@/models';

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<Category[]>([]);

	return { categories };
});
