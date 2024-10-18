<script setup lang="ts">
import IrdomLayout from '@/components/IrdomLayout.vue';
import apiClient from '@/api/BaseApi';
import { useToastStore } from '@/store/toast';
import { ToastType } from '@/models';
import { useToolbar } from '@/store/toolbar';
import router from '@/router';

const toastStore = useToastStore();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Удаление аккаунта',
	backUrl: '/profile/settings',
});

async function deleteAccount() {
	const { data } = await apiClient.GET('/auth/me');
	if (data) {
		const { response } = await apiClient.DELETE('/auth/user/{user_id}', {
			params: { path: { user_id: 1 } },
		});

		if (response.ok) {
			toastStore.push({
				title: 'Аккаунт успешно удален',
				type: ToastType.Info,
			});
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
		<div class="text-primary text-h5 d-flex justify-center mb-4">
			Вы действительно хотите удалить аккаунт? Это необратимо.
		</div>
		<v-btn color="red" class="w-100" size="large" @click="deleteAccount">Удалить аккаунт</v-btn>
	</IrdomLayout>
</template>
