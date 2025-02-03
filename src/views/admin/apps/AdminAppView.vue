<script setup lang="ts">
import apiClient from '@/api';
import { useAppsStore } from '@/store/apps';
import { useToastStore } from '@/store/toast';
import { ref, onMounted } from 'vue';

import IrdomLayout from '@/components/IrdomLayout.vue';
import CategoryInGrid from './CategoryInGrid.vue';
import CategoryInList from './CategoryInList.vue';

const appsStore = useAppsStore();
const toastStore = useToastStore();

const categories = ref(appsStore.categories);

onMounted(async () => {
	const { data, error } = await apiClient.GET('/services/category', {
		params: { query: { info: ['buttons'] } },
	});
	if (data) {
		appsStore.categories = data;
	} else if (error) {
		toastStore.push({
			title: 'Какая-то ошибка',
		});
	}
	console.log(appsStore.categories);
	categories.value = appsStore.categories;
});
</script>

<template>
	<IrdomLayout>
		<div class="text-h4 font-weight-bold">Категории сервисов</div>

		<v-expansion-panels class="mt-2">
			<v-expansion-panel v-for="category in categories" :key="category.id">
				<template #title>
					<v-btn variant="text" :text="category.name ?? ''" @click.stop="" />
				</template>
				<template #text>
					<CategoryInGrid v-if="category.type === 'grid3'" :buttons="category.buttons ?? []" />
					<CategoryInList v-else :buttons="category.buttons ?? []"></CategoryInList>
				</template>
			</v-expansion-panel>
		</v-expansion-panels>
	</IrdomLayout>
</template>
