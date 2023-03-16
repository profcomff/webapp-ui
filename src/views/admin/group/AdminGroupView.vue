<script setup lang="ts">
import { GroupInfo, authGroupApi } from '@/api/auth';
import { useAuthStore, useProfileStore } from '@/store';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { AccessAllowed, IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { scopename } from '@/models';
import { AuthApi } from '@/api';

const profileStore = useProfileStore();
const { hasTokenAccess } = profileStore;

const authStore = useAuthStore();
const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin/groups';
const route = useRoute();

const groupId = computed(() => +route.params.id);
const group = computed(() => authStore.groups.get(groupId.value));

onMounted(async () => {
	AuthApi.getScopes();

	if (!group.value) {
		const { data } = await authGroupApi.getGroup<GroupInfo.Scopes>(+route.params.id, [GroupInfo.Scopes]);
		authStore.setGroup(data);
	}
});

const deleteScope = async (scopeId: number) => {
	if (hasTokenAccess(scopename.auth.group.update) && group.value) {
		const ids = [...group.value.scopes.keys()].filter(id => id !== scopeId);

		await authGroupApi.patchGroup(group.value.id, { scopes: ids });
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		authStore.groups.get(groupId.value)!.scopes.delete(scopeId);
	}
};

const addScope = async (e: Event) => {
	if (hasTokenAccess(scopename.auth.group.update)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const scopeId = +formData.get('id')!.toString();

		if (profileStore.isUserLogged && group.value && scopeId) {
			await authGroupApi.patchGroup(groupId.value, { scopes: [...group.value.scopes.keys(), scopeId] });
			authStore.setGroupScopeById(groupId.value, scopeId);
			form.reset();
		}
	}
};
</script>

<template>
	<IrdomLayout title="Группа" backable :back="back">
		<AccessAllowed :scope="scopename.auth.scope.read" no-fallback>
			<h2>{{ group?.name }}</h2>
			<ScopesTable
				:scopes="group?.scopes.values() ?? []"
				style="margin-left: 16px; width: calc(100% - 16px)"
				delete-icon="delete"
				@delete="deleteScope"
			/>
		</AccessAllowed>

		<form @submit.prevent="addScope" class="form" v-if="hasTokenAccess(scopename.auth.group.update)">
			<MaterialIcon name="add" />

			<label for="id">
				id
				<input type="text" id="id" name="id" autocomplete="off" required list="scope-names" />

				<datalist id="scope-names">
					<option v-for="{ id, name } of authStore.scopes.values()" :value="id" :key="id">
						{{ name }}
					</option>
				</datalist>
			</label>

			<button type="submit">
				<MaterialIcon name="done" />
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
