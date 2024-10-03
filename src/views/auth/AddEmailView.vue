<script setup lang="ts">
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Добавление электронной почты',
	backUrl: '/profile/settings',
});

const emit = defineEmits<{
	success: [];
}>();

const router = useRouter();
const toastStore = useToastStore();

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	const newPassword = formData.get('password')?.toString();
	const repeatPassword = formData.get('repeat-password')?.toString();
	if (newPassword !== repeatPassword) {
		toastStore.push({
			title: 'Добавление Email',
			type: ToastType.Error,
			description: 'Пароли не совпадают',
		});
	}
	if (email && newPassword && newPassword == repeatPassword) {
		const { data } = await AuthApi.registerEmail(email, newPassword);
		if (data.status == 'Success') {
			toastStore.push({
				title: 'Успех!',
				description:
					'Мы отправили письмо с инструкциями по активации аккаунта на электронную почту',
			});
			emit('success');
		}
		router.push('/profile');
	}
};
</script>

<template>
	<IrdomLayout>
		<v-form
			class="loginform d-flex flex-column w-100 align-self-center ga-4"
			@submit.prevent="submitHandler"
		>
			<v-text-field
				type="email"
				name="email"
				autocomplete="email"
				label="Новый адрес электронной почты"
				required
				hide-details
			/>
			<v-text-field
				type="password"
				name="password"
				autocomplete="password"
				label="Пароль"
				required
				hide-details
			/>
			<v-text-field
				type="password"
				name="repeat-password"
				autocomplete="repeat-password"
				label="Повтор пароля"
				required
				hide-details
			/>
			<v-btn type="submit" color="primary" class="w-100" size="large">Добавить Email</v-btn>
		</v-form>
	</IrdomLayout>
</template>

<style scoped>
.email {
	color: #18185c;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.loginform {
	max-width: 700px;
	align-self: center;
}
</style>
