<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem } from '@/components';
import AsyncContent from './AsyncContent.vue';
import { authProfileApi } from '@/api/auth';
import { LocalStorage } from '@/models';
import { useProfileStore } from '@/store';
import { computed } from '@vue/reactivity';
import { onMounted } from 'vue';

const profileStore = useProfileStore();

const toolbarMenu = computed<ToolbarMenuItem[]>(() => {
	const arr: ToolbarMenuItem[] = [];
	if (profileStore.token) {
		arr.push({
			name: 'Выход',
			onClick: async () => {
				if (profileStore.token) {
					authProfileApi.logout(profileStore.token).then(() => {
						LocalStorage.removeToken();
						profileStore.updateToken();
					});
				}
			},
		});
	}

	return arr;
});

onMounted(() => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token as string);
	} else {
		profileStore.updateToken();
	}
});
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль">
		<template v-if="!profileStore.token">
			Вы еще не вошли в приложение
			<RouterLink to="/auth">Вход</RouterLink>
		</template>

		<Suspense v-else>
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>

<style scoped></style>
