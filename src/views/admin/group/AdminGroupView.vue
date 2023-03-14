<script setup lang="ts">
import { authGroupApi, authScopeApi } from '@/api/auth';
import { useAuthStore, useProfileStore } from '@/store';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';

const { token } = useProfileStore();
const authStore = useAuthStore();
const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin/groups';
const route = useRoute();

const groupId = computed(() => +route.params.id);
const group = computed(() => authStore.groups.get(groupId.value));

onMounted(async () => {
	if (!group.value) {
		const { data } = await authGroupApi.getGroup<'scopes'>(+route.params.id, {
			info: ['scopes'],
		});
		authStore.setGroup(data);
	}

	if (authStore.scopes.size === 0 && token) {
		const { data } = await authScopeApi.getScopes(token);
		authStore.setScopes(data);
	}
});

const deleteScope = async (scopeId: number) => {
	if (token && group.value) {
		const ids = [...group.value.scopes.keys()].filter(id => id !== scopeId);

		await authGroupApi.patchGroup(group.value.id, { scopes: ids }, token);
		authStore.groups.get(groupId.value)!.scopes.delete(scopeId);
	}
};

const addScope = async (e: Event) => {
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);

	const scopeId = +formData.get('id')!.toString();

	if (token && group.value && scopeId) {
		await authGroupApi.patchGroup(groupId.value, { scopes: [...group.value.scopes.keys(), scopeId] }, token);
		authStore.setGroupScopeById(groupId.value, scopeId);
		form.reset();
	}
};
</script>

<template>
	<IrdomLayout :back="back">
		<ScopesTable
			:scopes="group?.scopes.values() ?? []"
			style="margin-left: 16px; width: calc(100% - 16px)"
			delete-icon="delete"
			@delete="deleteScope"
		/>

		<form @submit.prevent="addScope" class="form">
			<MaterialIcon name="add" />

			<label for="id">
				id
				<input type="text" id="id" name="id" autocomplete="off" required list="scope-names" />

				<datalist id="scope-names">
					<option v-for="{ id, name } of authStore.scopes.values()" :value="id" :key="id">{{ name }}</option>
				</datalist>
			</label>

			<button type="submit">
				<MaterialIcon name="done" />
			</button>
		</form>
	</IrdomLayout>
</template>
<style>
.form {
	display: flex;
	gap: 16px;
	align-items: center;
	flex-wrap: wrap;
}

.form input {
	padding: 2px 8px;
}

.form label {
	display: flex;
	gap: 4px;
}
</style>
