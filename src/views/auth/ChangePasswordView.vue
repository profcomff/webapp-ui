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
	const old_password = formData.get('old-password')?.toString();
	const password = formData.get('password')?.toString();
	const repeat_password = formData.get('repeat-password')?.toString();

	if (password === repeat_password && email && old_password && password) {
		const response = await AuthApi.requestResetPassword(email, old_password, password);
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
};
</script>

<template>
	<IrdomLayout title="Изменение пароля" backable back="/profile/settings">
		<form class="form" @submit.prevent="submitHandler">
			<v-text-field
				type="email"
				name="email"
				autocomplete="email"
				class="input"
				density="compact"
				required
				variant="outlined"
				label="Email"
			/>
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
.field {
	text-align: left;
	width: 100%;
	max-width: 400px;
	align-self: center;
}

.forgot-pass {
	align-self: center;
	padding-bottom: 10px;
	max-width: 333px;
	justify-self: right;
	text-align: right;
	width: 100%;
	color: #18185c;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
}

.submit-login {
	width: 100%;
	max-width: 150px;
	align-self: center;
	margin: 5px auto 16px;
	border-radius: 8px !important;
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
