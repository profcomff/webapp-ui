<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
import { computed, onMounted } from 'vue';
import { useAuthStore, useProfileStore } from '@/store';
import { AuthApi } from '@/api';
import { MaterialIcon } from '@/components/lib';
import ScopesTable from '../ScopesTable.vue';
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import { scopename } from '@/models';

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
				style="width: 100%"
				@delete="deleteScope"
			/>
			<form class="form" @submit.prevent="createScope">
				<MaterialIcon name="add" />
				<label for="name">
					name
					<input id="name" type="text" name="name" autocomplete="off" required />
				</label>

				<label for="comment">
					comment
					<input id="comment" type="text" name="comment" autocomplete="off" />
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
