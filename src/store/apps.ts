import { Button, Category } from '@/api/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface StoreCategory extends Category {
	buttons: Button[];
}

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<StoreCategory[] | null>(null);

	return { categories };
});
