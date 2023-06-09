<script setup lang="ts">
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useAuthStore, useProfileStore } from '@/store';
import { IrdomLayout, AccessAllowed } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { scopename } from '@/models';
import { AuthApi } from '@/api';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const { hasTokenAccess } = profileStore;

const hasAccess = computed(() => hasTokenAccess(scopename.auth.scope.read));

onMounted(async () => {
	if (hasAccess.value) {
		AuthApi.getScopes();
	}
});

const deleteScope = async (scopeId: number) => {
	if (profileStore.isUserLogged) {
		await authScopeApi.deleteScope(scopeId);
		authStore.scopes.delete(scopeId);
	}
};

const createScope = async (e: Event) => {
	if (e.target) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const comment = formData.get('comment')?.toString();
		const name = formData.get('name')?.toString();

		if (name && profileStore.isUserLogged) {
			const { data } = await authScopeApi.createScope({ comment, name });

			form.reset();
			authStore.setScopes([data]);
		}
	}
};
</script>

<template>
	<IrdomLayout title="Права доступа" backable back="/admin">
		<AccessAllowed :scope="scopename.auth.scope.read">
			<ScopesTable
				:scopes="authStore.scopes.values()"
				delete-icon="delete_forever"
				@delete="deleteScope"
				style="width: 100%"
			/>
			<form @submit.prevent="createScope" class="form">
				<MaterialIcon name="add" />
				<label for="name">
					name
					<input type="text" id="name" name="name" autocomplete="off" required />
				</label>

				<label for="comment">
					comment
					<input type="text" id="comment" name="comment" autocomplete="off" />
				</label>

				<button type="submit">
					<MaterialIcon name="done" />
				</button>
			</form>
		</AccessAllowed>
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
