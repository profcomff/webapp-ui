<script setup lang="ts">
import { AuthApi } from '@/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');

const submit = async () => {
	await AuthApi.loginEmail(email.value, password.value);
	router.push('/profile');
};
</script>
<template>
	<v-sheet width="500" class="align-self-center">
		<v-form @submit.prevent="submit">
			<v-text-field v-model="email" label="email" type="email" />
			<v-text-field v-model="password" label="Пароль" type="password" />
			<v-btn color="primary" type="submit" class="w-100">Войти</v-btn>
		</v-form>
	</v-sheet>
</template>
<style module></style>
