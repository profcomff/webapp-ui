<script setup lang="ts">
import { useRoute } from 'vue-router';
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import router from '@/router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';

const route = useRoute();
const toastStore = useToastStore();

const submitHandler = async () => {
	if (route.query.token) {
		const response = await AuthApi.resetEmail(route.query.token as string);
		if (response) {
			toastStore.push({
				title: 'Изменение Email',
				type: ToastType.Info,
				description: 'Email успешно изменен',
			});
		} else {
			toastStore.push({
				title: 'Изменение Email',
				type: ToastType.Info,
				description: 'Что-то пошло не так',
			});
		}
	}
	router.push('/auth');
};
</script>

<template>
	<IrdomLayout title="Изменение Email">
		<v-btn type="submit" class="submit" color="#fff" @click="submitHandler"> Сменить Email </v-btn>
	</IrdomLayout>
</template>

<style scoped>
.submit {
	position: absolute !important;
	width: 100%;
	max-width: 220px;
	align-self: center !important;
	margin: 30px auto !important;
	border-radius: 8px !important;
}
</style>
