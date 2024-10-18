<script setup lang="ts">
import apiClient from '@/api';
import IrdomLayout from '@/components/IrdomLayout.vue';
import router from '@/router';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Удаление аккаунта',
	backUrl: '/profile/settings',
});

async function deleteUser() {
	const { data } = await apiClient.GET('/auth/me');
	if (data) {
		apiClient.DELETE('/auth/user/{user_id}', { params: { path: { user_id: data.id } } });
		router.push('/auth');
	}
}
</script>

<template>
	<IrdomLayout>
		<div class="text-primary text-h6 d-flex justify-center mb-4">
			Вы точно хотите удалить аккаунт? Это необратимо.
		</div>
		<v-btn color="red" width="w-100" size="large" @click="deleteUser">Удалить аккаунт</v-btn>
	</IrdomLayout>
</template>
