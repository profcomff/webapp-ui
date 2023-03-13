<script setup lang="ts">
import { authGroupApi, authScopeApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import ScopesTable from '../ScopesTable.vue';
import { computed } from '@vue/reactivity';
import { LocalStorage } from '@/models';
import { onMounted } from 'vue';
import { Scope } from '@/api/models';
import { useRoute } from 'vue-router';
import { IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';

const token = LocalStorage.getToken();
const authStore = useAuthStore();
const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin/groups';
const route = useRoute();

const groupId = computed(() => +route.params.id);
const group = computed(() => authStore.groups.get(groupId.value));
const scopes = computed(() => {
	if (group.value) {
		const arr = [];
		for (const scopeId of group.value.scopes) {
			const scope = authStore.scopes.get(scopeId);
			if (scope) {
				arr.push(scope);
			}
		}
		return arr;
	}
	return null;
});

onMounted(async () => {
	if (!group.value) {
		const { data } = await authGroupApi.getGroup(+route.params.id, {
			info: ['scopes', 'child'],
		});
		authStore.addGroup({ ...data, children: [], scopes: data.scopes.map(s => s.id) });
	}

	if (authStore.scopes.size === 0 && token) {
		const { data } = await authScopeApi.getScopes(token);
		for (const scope of data) {
			authStore.scopes.set(scope.id, scope);
		}
	}
});

const deleteScope = async (scope: Scope) => {
	if (token && group.value) {
		const names = group.value.scopes.filter(id => id !== scope.id);
		const ids = names.map(name => authStore.scopes.get(name)!.id);

		await authGroupApi.patchGroup(group.value.id, { scopes: ids }, token);
		authStore.groups.get(groupId.value)!.scopes = names;
	}
};

const addScope = async (e: Event) => {
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);

	const scopeId = +formData.get('id')!.toString();

	if (token && group.value && scopeId) {
		await authGroupApi.patchGroup(groupId.value, { scopes: [...group.value.scopes, scopeId] }, token);
		authStore.groups.get(groupId.value)?.scopes.push();
		form.reset();
	}
};
</script>

<template>
	<IrdomLayout :back="back">
		<ScopesTable
			:scopes="scopes ?? []"
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
					<option v-for="{ id, name } of authStore.scopes.values()" :value="id">{{ name }}</option>
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
