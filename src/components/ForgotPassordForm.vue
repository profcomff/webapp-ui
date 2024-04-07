<script setup lang="ts">
import { AuthApi } from '@/api';
import { useToastStore } from '@/store/toast';
import { ref } from 'vue';

const toastStore = useToastStore();

const email = ref('');
const emit = defineEmits<{
	success: [];
}>();

const submit = async () => {
	const { data } = await AuthApi.requestResetForgottenPassword(email.value);
	if (data.status == 'Success') {
		toastStore.push({
			title: 'Успех!',
			description:
				'Мы отправили письмо с инструкциями по восстановлению пароля на электронную почту',
		});
		emit('success');
	}
};
</script>
<template>
	<v-form class="d-flex flex-column w-100 align-self-center ga-4" @submit.prevent="submit">
		<v-text-field v-model="email" label="E-mail" type="email" />
		<v-btn color="primary" type="submit" class="w-100">Восстановить пароль</v-btn>
	</v-form>
</template>
