<script setup lang="ts">
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { AuthApi } from '@/api';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import AccessAllowed from '@/components/AccessAllowed.vue';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';

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
				class="table"
				@delete="deleteScope"
			/>
			<v-form class="d-flex form" @submit.prevent="createScope">
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
