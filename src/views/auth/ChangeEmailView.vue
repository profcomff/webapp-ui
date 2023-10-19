<script setup lang="ts">
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import { useToastStore } from '@/store';
import { ref } from 'vue';
import { IrdomLayout } from '@/components';
import { useRouter } from 'vue-router';

const checkPasswords = ref(false);
checkPasswords.value = false;
const router = useRouter();
const toastStore = useToastStore();

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	if (email) {
		const response = await AuthApi.requestResetEmail(email);
		if (response) {
			toastStore.push({
				title: 'Изменение Email',
				type: ToastType.Info,
				description: 'На вашу почту отправлено сообщение об изменении Email',
			});
			router.push('/profile');
		}
	}
};
</script>

<template>
	<IrdomLayout title="Изменение пароля" backable back="/profile/settings">
		<div class="email">Текущий адрес электронной почты</div>
		<form class="form" @submit.prevent="submitHandler">
			<v-text-field
				type="email"
				name="email"
				autocomplete="email"
				class="input"
				density="compact"
				required
				variant="outlined"
				label="Новый Email"
			/>
			<v-btn type="submit" class="submit-register" color="#fff">Изменить Email</v-btn>
		</form>
	</IrdomLayout>
</template>

<style scoped>
.email {
	color: #18185c;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.submit-register {
	width: 100%;
	max-width: 200px;
	align-self: center;
	margin: 20px auto 16px;
	border-radius: 8px !important;
}

.input {
	align-self: center;
	align-items: center;
	width: 100%;
	max-width: 400px;
	margin: 0 auto 5px;
}

.form {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>