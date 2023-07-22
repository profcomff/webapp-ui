<script setup lang="ts">
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { useAuthStore, useProfileStore } from '@/store';
import { IrdomLayout, AccessAllowed } from '@/components';
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
				class="table"
			/>
			<v-form @submit.prevent="createScope" class="d-flex form">
				<v-text-field name="name" autocomplete="off" label="name" prepend-icon="md:add" required />
				<v-text-field label="comment" name="comment" autocomplete="off" />

				<v-btn type="submit" icon="md:done" />
			</v-form>
		</AccessAllowed>
	</IrdomLayout>
</template>

<style scoped>
.form {
	gap: 16px;
}

.table {
	margin-bottom: 40px;
}
</style>
