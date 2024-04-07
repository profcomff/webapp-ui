<script setup lang="ts">
import { useRoute } from 'vue-router';
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import router from '@/router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const toastStore = useToastStore();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Изменение Email',
});

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
	<IrdomLayout>
		<v-form class="loginform">
			<h2>Внимание!</h2>
			<p>Нажимая эту кнопку вы подтверждаете смену Email адреса</p>
			<v-btn type="submit" color="primary" @click="submitHandler"> Сменить Email </v-btn>
		</v-form>
	</IrdomLayout>
</template>

<style scoped>
.loginform {
	max-width: 700px;
	align-self: center;
}
</style>
