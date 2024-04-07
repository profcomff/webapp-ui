<script setup lang="ts">
import { AuthApi } from '@/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits<{
	'reset-password': [];
}>();

const email = ref('');
const password = ref('');

const submit = async () => {
	await AuthApi.loginEmail(email.value, password.value);
	router.push('/profile');
};
</script>
<template>
	<v-form class="d-flex flex-column w-100 align-self-center ga-4" @submit.prevent="submit">
		<v-text-field v-model="email" label="E-mail" type="email" />
		<v-text-field v-model="password" label="Пароль" type="password" />
		<v-btn color="primary" type="submit" class="w-100">Войти</v-btn>
		<v-btn variant="plain" class="w-100" @click="emit('reset-password')"> Забыли пароль </v-btn>
	</v-form>
</template>
