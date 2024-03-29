<script setup lang="ts">
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Изменение пароля',
	backUrl: '/profile/settings',
});

const checkPasswords = ref(false);
checkPasswords.value = false;
const router = useRouter();
const toastStore = useToastStore();

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const old_password = formData.get('old-password')?.toString();
	const password = formData.get('password')?.toString();
	const repeat_password = formData.get('repeat-password')?.toString();

	if (password === repeat_password && old_password && password) {
		const response = await AuthApi.requestResetPassword(old_password, password);
		if (response) {
			toastStore.push({
				title: 'Изменение пароля',
				type: ToastType.Info,
				description: 'Пароль успешно изменен',
			});
			router.push('/profile');
		}
	} else {
		checkPasswords.value = true;
	}

	if (repeat_password !== password) {
		toastStore.push({
			title: 'Изменение пароля',
			type: ToastType.Error,
			description: 'Пароли не совпадают',
		});
	}
};
</script>

<template>
	<IrdomLayout>
		<form class="form" @submit.prevent="submitHandler">
			<v-text-field
				variant="outlined"
				type="password"
				name="old-password"
				class="input"
				density="compact"
				label="Старый пароль"
				required
			/>

			<v-text-field
				variant="outlined"
				type="password"
				name="password"
				class="input"
				density="compact"
				label="Новый пароль"
				required
			/>

			<v-text-field
				variant="outlined"
				type="password"
				name="repeat-password"
				class="input"
				density="compact"
				label="Повтор пароля"
				required
			/>
			<div v-if="checkPasswords" class="password-validate">Пароли должны совпадать</div>
			<v-btn type="submit" class="submit-register" color="#fff">Изменить пароль</v-btn>
		</form>
	</IrdomLayout>
</template>

<style scoped>
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

.password-validate {
	color: #f19035;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
	margin: 0 auto;
	text-align: center;
}
</style>
