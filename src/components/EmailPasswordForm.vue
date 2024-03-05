<script setup lang="ts">
import { ToastType } from '@/models';
import { useToastStore } from '@/store/toast';
import { computed, ref } from 'vue';

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

const toastStore = useToastStore();

const checkPasswords = ref(false);
const buttonText = computed(() => (props.mode === 'login' ? 'Войти' : 'Зарегистрироваться'));

async function submitHandler(event: Event) {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();
	const repeat_password = formData.get('repeat-password')?.toString();

	if (password === repeat_password || props.mode === 'login') {
		if (email && password) {
			emits('submit', { email, password });
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
}
</script>

<template>
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
			name="password"
			:autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
			class="input"
			density="compact"
			label="Пароль"
			required
		/>

		<div v-if="$props.mode === 'login'" class="forgot-pass">
			<router-link to="/auth/forgot-password">Не помню пароль</router-link>
		</div>

		<v-text-field
			v-if="$props.mode === 'register'"
			variant="outlined"
			type="password"
			name="repeat-password"
			class="input"
			density="compact"
			label="Повтор пароля"
			required
		/>
		// TODO: проверка на совпадение паролей только при регистрации (мб вообще разделить на два
		компонента)
		<div v-if="checkPasswords" class="password-validate">Пароли должны совпадать</div>
		<v-btn type="submit" color="#fff">{{ buttonText }}</v-btn>
	</form>
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
	text-align: right;
	width: 100%;
	color: #18185c;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
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
