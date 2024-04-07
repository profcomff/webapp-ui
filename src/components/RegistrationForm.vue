<script setup lang="ts">
import { AuthApi } from '@/api';
import { useToastStore } from '@/store/toast';
import { ref } from 'vue';

const toastStore = useToastStore();

const email = ref('');
const password = ref('');
const repeatedPassword = ref('');
const emit = defineEmits<{
	success: [];
}>();

const submit = async () => {
	if (repeatedPassword.value !== password.value) {
		return toastStore.push({
			title: 'Пароли не совпадают',
		});
	}
	const { data } = await AuthApi.registerEmail(email.value, password.value);
	if (data.status == 'Success') {
		toastStore.push({
			title: 'Успех!',
			description: 'Мы отправили письмо с инструкциями по активации аккаунта на электронную почту',
		});
		emit('success');
	}
};
</script>
<template>
	<v-form class="d-flex flex-column w-100 align-self-center ga-4" @submit.prevent="submit">
		<v-text-field v-model="email" label="E-mail" type="email" />
		<v-text-field v-model="password" label="Пароль" type="password" autocomplete="new-password" />
		<v-text-field
			v-model="repeatedPassword"
			label="Повторите пароль"
			type="password"
			autocomplete="repeat-password"
		/>
		<v-btn color="primary" type="submit" class="w-100" size="large">Зарегистрироваться</v-btn>
	</v-form>
</template>
