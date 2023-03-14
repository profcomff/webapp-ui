<script setup lang="ts">
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import { LocalStorage } from '@/models';
import ScopesTable from '../ScopesTable.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store';
import { IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';

const token = LocalStorage.getToken();
const authStore = useAuthStore();

onMounted(async () => {
	if (token && authStore.scopes.size === 0) {
		const scopes = await authScopeApi.getScopes(token).then(res => res.data);
		for (const scope of scopes) {
			authStore.scopes.set(scope.id, scope);
		}
	}
});

const deleteScope = async (scopeId: number) => {
	if (token) {
		await authScopeApi.deleteScope(scopeId, token);
		authStore.scopes.delete(scopeId);
	}
};

const createScope = async (e: Event) => {
	if (e.target) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const comment = formData.get('comment')?.toString();
		const name = formData.get('name')?.toString();

		if (name && token) {
			const { data } = await authScopeApi.createScope({ comment, name }, token);

			form.reset();
			authStore.scopes.set(data.id, data);
		}
	}
};
</script>

<template>
	<IrdomLayout title="Редактирование прав доступа" back="/admin">
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
