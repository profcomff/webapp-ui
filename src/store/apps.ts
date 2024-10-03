import { AppButton, AppButtonCategory } from '@/api/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface StoreCategory extends AppButtonCategory {
	buttons: AppButton[];
}

export const useAppsStore = defineStore('apps', () => {
	const categories = ref<StoreCategory[] | null>(null);

	return { categories };
});
