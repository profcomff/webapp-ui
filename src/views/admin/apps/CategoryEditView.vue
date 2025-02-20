<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore } from '@/store/toast';
import { useAppsStore } from '@/store/apps';
import { Category, Scope, ToastType } from '@/models';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import apiClient from '@/api';

import IrdomLayout from '@/components/IrdomLayout.vue';
import CategoryInGrid from './CategoryInGrid.vue';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();
const appStore = useAppsStore();
const toolbar = useToolbar();
const { mobile } = useDisplay();
const allScopes = ref<Scope[]>();

toolbar.setup({
	title: 'Редактирование категории',
	backUrl: '/admin/apps',
});

const categoryId = computed(() => Number(route.params.id));
const category = ref<Category>();
const categoryName = ref<string>('');
const categoryScope = ref('');

onMounted(async () => {
	const { data, error } = await apiClient.GET('/services/category', {
		params: { query: { info: ['buttons'] } },
	});
	if (data) {
		appStore.categories = data;
	} else if (error) {
		toastStore.push({
			title: String(error.detail),
		});
	}

	const { data: scopeData, error: scopeError } = await apiClient.GET('/auth/scope');
	if (scopeData) {
		allScopes.value = scopeData;
	} else {
		toastStore.push({
			title: String(scopeError),
		});
	}

	console.log(allScopes.value);
	category.value = appStore.categories.find(item => item.id == categoryId.value);
	categoryName.value = category.value?.name ?? 'нет имени';
});

async function renameCategory(name: string) {
	console.log(name);
	const { data, error } = await apiClient.PATCH('/services/category/{category_id}', {
		params: { path: { category_id: categoryId.value } },
		body: { name: name },
	});
	if (data) {
		toastStore.push({
			title: `Категория переименована в ${name}`,
		});
	}
	if (error) {
		toastStore.push({
			title: String(error.detail),
			type: ToastType.Error,
		});
	}
}

async function addScope(scopeName: string) {
	let newScopes = new Array<string>();
	if (category.value?.scopes && category.value.scopes.length > 0) {
		category.value?.scopes?.push(scopeName);
		newScopes = category.value.scopes;
	} else {
		newScopes = [scopeName];
	}
	const { data, error } = await apiClient.PATCH('/services/category/{category_id}', {
		params: { path: { category_id: categoryId.value } },
		body: {
			scopes: newScopes,
		},
	});
	if (data) {
		toastStore.push({
			title: `Добавлен скоуп ${scopeName}`,
		});
		location.reload();
	}
	if (error) {
		toastStore.push({
			title: String(error.detail),
			type: ToastType.Error,
		});
	}
}

async function removeScope(scopeName: string) {
	let newScopes = new Array<string>();
	if (category.value?.scopes && category.value.scopes.length > 0) {
		const idx = category.value.scopes.findIndex(item => item == scopeName);
		category.value.scopes.splice(idx, 1);
		newScopes = category.value.scopes;
	}
	const { data, error } = await apiClient.PATCH('/services/category/{category_id}', {
		params: { path: { category_id: categoryId.value } },
		body: {
			scopes: newScopes,
		},
	});
	if (data) {
		toastStore.push({
			title: `Удален скоуп ${scopeName}`,
		});
		location.reload();
	}
	if (error) {
		toastStore.push({
			title: String(error.detail),
			type: ToastType.Error,
		});
	}
}

async function deleteCategory() {
	const { data, error } = await apiClient.DELETE('/services/category/{category_id}', {
		params: { path: { category_id: categoryId.value } },
	});
	if (data) {
		toastStore.push({
			title: `Категория удалена`,
		});
		router.push('/admin/apps');
	}
	if (error) {
		toastStore.push({
			title: String(error.detail),
			type: ToastType.Error,
		});
	}
}
</script>

<template>
	<IrdomLayout>
		<div>
			<v-row class="align-center">
				<v-col>
					<v-text-field
						v-model="categoryName"
						class="my-2"
						variant="solo"
						density="compact"
						max-height="40"
						hide-details
						single-line
						type="text"
				/></v-col>
				<v-col :cols="mobile ? 2 : 1">
					<v-btn icon="md:save" density="comfortable" @click="renameCategory(categoryName)" />
				</v-col>
			</v-row>
			<CategoryInGrid v-if="category?.type == 'grid3'" :buttons="category.buttons ?? []" />
			<div class="text-h5">Скоупы категории</div>
			<v-chip-group v-if="category?.scopes && category.scopes.length > 0">
				<v-chip
					v-for="scope in category?.scopes"
					:key="scope"
					:text="scope"
					append-icon="md:delete"
					@click="removeScope(scope)"
					>{{ scope }}</v-chip
				>
			</v-chip-group>
			<div v-else>Скоупов нет</div>
			<v-row class="align-center">
				<v-col>
					<v-combobox
						v-model="categoryScope"
						:items="allScopes?.map(item => item.name)"
						class="my-2 text-caption"
						variant="solo"
						density="compact"
						max-height="40"
						hide-details
						single-line
						auto-select-first="exact"
						type="text"
					/>
				</v-col>
				<v-col :cols="mobile ? 2 : 1">
					<v-btn
						icon="md:add"
						density="comfortable"
						:disabled="!!categoryScope"
						@click="addScope(categoryScope)"
					/>
				</v-col>
			</v-row>

			<v-dialog max-width="500">
				<template #activator="{ props: activatorProps }">
					<v-btn v-bind="activatorProps" class="mt-2" text="Удалить категорию" color="red" />
				</template>

				<template #default="{ isActive }">
					<v-card title="Точно удалить категорию?" subtitle="Это будет тяжело восстановить">
						<v-card-actions>
							<v-btn text="Я передумал" @click="isActive.value = false" />
							<v-spacer />
							<v-btn text="Точно удалить" @click="deleteCategory" />
						</v-card-actions>
					</v-card>
				</template>
			</v-dialog>
		</div>
	</IrdomLayout>
</template>
