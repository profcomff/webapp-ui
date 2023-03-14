<script setup lang="ts">
import { GroupInfo, authGroupApi, authScopeApi } from '@/api/auth';
import { useAuthStore, useProfileStore } from '@/store';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { scopename } from '@/models';

const { isUserLogged, hasTokenAccess } = useProfileStore();
const authStore = useAuthStore();
const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin/groups';
const route = useRoute();

const groupId = computed(() => +route.params.id);
const group = computed(() => authStore.groups.get(groupId.value));

onMounted(async () => {
	if (!group.value) {
		const { data } = await authGroupApi.getGroup<GroupInfo.Scopes>(+route.params.id, {
			info: [GroupInfo.Scopes],
		});
		authStore.setGroup(data);
	}

	if (hasTokenAccess(scopename.auth.scope.read) && authStore.scopes.size === 0) {
		const { data } = await authScopeApi.getScopes();
		authStore.setScopes(data);
	}
});

const deleteScope = async (scopeId: number) => {
	if (hasTokenAccess(scopename.auth.group.update) && group.value) {
		const ids = [...group.value.scopes.keys()].filter(id => id !== scopeId);

		await authGroupApi.patchGroup(group.value.id, { scopes: ids });
		authStore.groups.get(groupId.value)!.scopes.delete(scopeId);
	}
};

const addScope = async (e: Event) => {
	if (hasTokenAccess(scopename.auth.group.update)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const scopeId = +formData.get('id')!.toString();

		if (isUserLogged() && group.value && scopeId) {
			await authGroupApi.patchGroup(groupId.value, { scopes: [...group.value.scopes.keys(), scopeId] });
			authStore.setGroupScopeById(groupId.value, scopeId);
			form.reset();
		}
	}
};
</script>

<template>
	<IrdomLayout backable :back="back">
		<template v-if="hasTokenAccess(scopename.auth.scope.read)">
			<ScopesTable
				:scopes="group?.scopes.values() ?? []"
				style="margin-left: 16px; width: calc(100% - 16px)"
				delete-icon="delete"
				@delete="deleteScope"
			/>

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
		</template>
		<h1 v-else>403 Forbidden</h1>
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
