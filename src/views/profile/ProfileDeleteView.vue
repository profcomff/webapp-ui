<script setup lang="ts">
import IrdomLayout from '@/components/IrdomLayout.vue';
import apiClient from '@/api';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';
import { useProfileStore } from '@/store/profile';
import router from '@/router';
import { ToastType } from '@/models';

const toolbar = useToolbar();
const toastStore = useToastStore();
const profileStore = useProfileStore();

toolbar.setup({
	title: 'Удаление аккаунта',
	backUrl: '/profile/settings',
});

async function deleteUser() {
	const { data } = await apiClient.GET('/auth/me');
	if (data) {
		const { response } = await apiClient.DELETE('/auth/user/{user_id}', {
			params: { path: { user_id: data.id } },
		});

		if (response.ok) {
			toastStore.push({
				title: 'Аккаунт успешно удален',
				type: ToastType.Info,
			});
			profileStore.deleteToken();
			router.push('/auth');
		} else {
			toastStore.push({
				title: 'Не удалось удалить аккаунт',
				type: ToastType.Error,
			});
		}
	} else {
		toastStore.push({
			title: 'Возникла проблема',
			type: ToastType.Error,
			description: 'Что-то пошло не так на сервере',
		});
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
