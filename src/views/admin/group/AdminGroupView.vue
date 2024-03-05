<script setup lang="ts">
import { GroupInfo, authGroupApi } from '@/api/auth';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { AuthApi } from '@/api';
import AccessAllowed from '@/components/AccessAllowed.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import MaterialIcon from '@/components/MaterialIcon.vue';

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
		const { data } = await authGroupApi.getGroup<GroupInfo.Scopes>(+route.params.id, [
			GroupInfo.Scopes
		]);
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
			await authGroupApi.patchGroup(groupId.value, {
				scopes: [...group.value.scopes.keys(), scopeId]
			});
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

		<form
			v-if="hasTokenAccess(scopename.auth.group.update)"
			class="form"
			@submit.prevent="addScope"
		>
			<MaterialIcon icon="add" />

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
				<MaterialIcon icon="done" />
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
