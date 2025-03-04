<script setup lang="ts">
import ScopesTable from '../ScopesTable.vue';
import { onMounted, computed } from 'vue';
import { AuthApi } from '@/api';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import AccessRestricted from '@/components/AccessRestricted.vue';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { useToolbar } from '@/store/toolbar';
import { apiClient } from '@/api/';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const toolbar = useToolbar();

const { hasTokenAccess } = profileStore;
toolbar.setup({
	title: 'Права доступа',
	backUrl: '/admin',
});

const hasAccess = computed(() => hasTokenAccess(scopename.auth.scope.read));

onMounted(async () => {
	if (hasAccess.value) {
		AuthApi.getScopes();
	}
});

const deleteScope = async (scopeId: number) => {
	if (profileStore.isUserLogged) {
		await apiClient.DELETE('/auth/scope/{id}', { params: { path: { id: scopeId } } });
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
			const { data } = await apiClient.POST('/auth/scope', {
				body: { comment, name },
			});
			form.reset();

			if (data) {
				authStore.setScopes([data]);
			}
		}
	}
};
</script>

<template>
	<IrdomLayout>
		<AccessRestricted :scope="scopename.auth.scope.read">
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

			<template #fallback>
				<h2>Access restricted</h2>
			</template>
		</AccessRestricted>
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
