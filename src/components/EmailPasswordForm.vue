<script setup lang="ts">
import { computed } from 'vue';

export interface SubmitData {
	email: string;
	password: string;
}

const props = defineProps<{
	mode: 'login' | 'register';
}>();

const emits = defineEmits<{
	submit: [data: SubmitData];
}>();

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (email && password) {
		emits('submit', { email, password });
	}
};

const buttonText = computed(() => (props.mode === 'login' ? 'Вход' : 'Регистрация'));
</script>

<template>
	<form class="form" @submit.prevent="submitHandler">
		<v-text-field
			type="email"
			name="email"
			autocomplete="email"
			placeholder="Введите почту"
			class="input"
			required
		/>
		<v-text-field
			type="password"
			name="password"
			:autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
			placeholder="Введите пароль"
			class="input"
			required
		/>
		<v-btn type="submit" class="submit">{{ buttonText }}</v-btn>
	</form>
</template>

<style scoped>
.submit {
	width: 100%;
	max-width: 400px;
	align-self: center;
	background: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-on-primary));
	margin: 0 auto 16px;
}

.input {
	align-self: center;
	width: 100%;
	max-width: 400px;
	margin: 0 auto 24px;
}

.form {
	display: flex;
	flex-direction: column;
	align-items: center;

	@media screen and (width <= 575px) {
		margin-top: 50%;
	}
}
</style>
