<script setup lang="ts">
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { AuthApi } from '@/api';
import apiClient from '@/api/';
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { useToolbar } from '@/store/toolbar';

const profileStore = useProfileStore();
const toolbar = useToolbar();

const { hasTokenAccess } = profileStore;
toolbar.setup({
	title: 'Группа',
	backUrl: '/admin/groups',
});

const authStore = useAuthStore();
const route = useRoute();

const groupId = computed(() => +route.params.id);
const group = computed(() => authStore.groups.get(groupId.value));

onMounted(async () => {
	AuthApi.getScopes();

	if (!group.value) {
		const { data } = await apiClient.GET('/auth/group/{id}', {
			params: {
				path: { id: groupId.value },
				query: { info: ['scopes'] },
			},
		});
		if (data) {
			authStore.setGroup(data);
		}
	}
});

const deleteScope = async (scopeId: number) => {
	if (hasTokenAccess(scopename.auth.group.update) && group.value) {
		const ids = [...group.value.scopes.keys()].filter(id => id !== scopeId);

		await apiClient.PATCH('/auth/group/{id}', {
			params: { path: { id: group.value.id } },
			body: { scopes: ids },
		});
		authStore.groups.get(groupId.value)!.scopes.delete(scopeId);
	}
};

const addScope = async (e: Event) => {
	if (hasTokenAccess(scopename.auth.group.update)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const scopeId = +formData.get('id')!.toString();

		if (profileStore.isUserLogged && group.value && scopeId) {
			await apiClient.PATCH('/auth/group/{id}', {
				params: { path: { id: groupId.value } },
				body: { scopes: [...group.value.scopes.keys(), scopeId] },
			});
			authStore.setGroupScopeById(groupId.value, scopeId);
			form.reset();
		}
	}
};
</script>

<template>
	<IrdomLayout>
		<AccessRestricted :scope="scopename.auth.scope.read">
			<h2>{{ group?.name }}</h2>
			<ScopesTable
				:scopes="group?.scopes.values() ?? []"
				style="margin-left: 16px; width: calc(100% - 16px)"
				delete-icon="delete"
				@delete="deleteScope"
			/>
		</AccessRestricted>

		<form
			v-if="hasTokenAccess(scopename.auth.group.update)"
			class="form"
			@submit.prevent="addScope"
		>
			<v-icon icon="add" />

			<label for="id">
				id
				<input id="id" type="text" name="id" autocomplete="off" required list="scope-names" />

				<datalist id="scope-names">
					<option v-for="{ id, name } of authStore.scopes.values()" :key="id" :value="id">
						{{ name }}
					</option>
				</datalist>
			</label>

			<button type="submit">
				<v-icon icon="done" />
			</button>
		</form>
	</IrdomLayout>
</template>

<style scoped>
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
