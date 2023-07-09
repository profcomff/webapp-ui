<script setup lang="ts">
import { IrdomInput, IrdomButton } from './lib';

import { computed } from 'vue';

export interface SubmitData {
	email: string;
	password: string;
}

const props = defineProps<{
	mode: 'login' | 'register';
}>();

const emits = defineEmits<{
	(e: 'submit', data: SubmitData): void;
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
		<IrdomInput type="email" name="email" autocomplete="email" placeholder="Введите почту" class="input" required />
		<IrdomInput
			type="password"
			name="password"
			:autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
			placeholder="Введите пароль"
			class="input"
			required
		/>
		<IrdomButton type="submit" class="submit">{{ buttonText }}</IrdomButton>
	</form>
</template>

<style scoped>
.submit {
	width: 100%;
	max-width: 400px;
	align-self: center;
	background: var(--color-primary);
	color: white;
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
