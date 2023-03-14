<script setup lang="ts">
import { AnonymousMessage, IrdomLayout, ToolbarMenuItem } from '@/components';
import AsyncContent from './AsyncContent.vue';
import { MeInfo, authProfileApi } from '@/api/auth';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';

const profileStore = useProfileStore();

const logout = async () => {
	if (profileStore.token) {
		await authProfileApi.logout();
		LocalStorage.delete(LocalStorageItem.Token);
		LocalStorage.delete(LocalStorageItem.TokenScopes);
		profileStore.updateToken();
		profileStore.updateTokenScopes();
	}
};

const toolbarMenu = computed<ToolbarMenuItem[]>(() => {
	const arr: ToolbarMenuItem[] = [];
	if (profileStore.token) {
		arr.push({
			name: 'Выход',
			onClick: logout,
		});
	}

	return arr;
});

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;

		const { data } = await authProfileApi.getMe<MeInfo.TokenScopes>({ info: [MeInfo.TokenScopes] });
		LocalStorage.set<string[]>(
			LocalStorageItem.TokenScopes,
			data.session_scopes.map(s => s.name),
		);
	}
	profileStore.updateToken();
	profileStore.updateTokenScopes();
});
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль">
		<Suspense v-if="profileStore.token">
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
		<AnonymousMessage v-else />
	</IrdomLayout>
</template>

<style scoped></style>
