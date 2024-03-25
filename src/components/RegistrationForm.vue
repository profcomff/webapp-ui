<script setup lang="ts">
import { AuthApi } from '@/api';
import { useToastStore } from '@/store/toast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toastStore = useToastStore();

const email = ref('');
const password = ref('');
const repeatedPassword = ref('');

const submit = async () => {
	if (repeatedPassword.value !== password.value) {
		return toastStore.push({
			title: 'Пароли не совпадают',
		});
	}
	await AuthApi.registerEmail(email.value, password.value);
	router.push('/auth');
};
</script>
<template>
	<v-sheet width="500" class="align-self-center">
		<v-form @submit.prevent="submit">
			<v-text-field v-model="email" label="E-mail" type="email" />
			<v-text-field v-model="password" label="Пароль" type="password" autocomplete="new-password" />
			<v-text-field
				v-model="repeatedPassword"
				label="Повторите пароль"
				type="password"
				autocomplete="new-password"
			/>
			<v-btn color="primary" type="submit" class="w-100">Войти</v-btn>
		</v-form>
	</v-sheet>
</template>
