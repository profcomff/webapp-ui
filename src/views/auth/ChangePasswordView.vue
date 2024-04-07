<script setup lang="ts">
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Изменение пароля',
	backUrl: '/profile/settings',
});

const router = useRouter();
const toastStore = useToastStore();
const old_password = ref('');
const new_password = ref('');
const repeat_password = ref('');

const submitHandler = async () => {
	if (new_password.value === repeat_password.value && old_password.value && new_password.value) {
		const response = await AuthApi.requestResetPassword(old_password.value, new_password.value);
		if (response) {
			toastStore.push({
				title: 'Изменение пароля',
				type: ToastType.Info,
				description: 'Пароль успешно изменен',
			});
			router.push('/profile');
		}
	}

	if (repeat_password.value !== new_password.value) {
		toastStore.push({ title: 'Пароли не совпадают' });
	}
};
</script>

<template>
	<IrdomLayout>
		<form
			class="loginform d-flex flex-column w-100 align-self-center ga-4"
			@submit.prevent="submitHandler"
		>
			<v-text-field
				v-model="old_password"
				type="password"
				name="old-password"
				label="Старый пароль"
				required
			/>

			<v-text-field
				v-model="new_password"
				type="password"
				name="password"
				label="Новый пароль"
				autocomplete="new-password"
				required
			/>

			<v-text-field
				v-model="repeat_password"
				type="password"
				name="repeat-password"
				label="Повтор пароля"
				autocomplete="repeat-password"
				required
			/>
			<v-btn type="submit" size="large" class="w-100" color="primary"> Изменить пароль </v-btn>
		</form>
	</IrdomLayout>
</template>

<style scoped>
.loginform {
	width: 100%;
	max-width: 700px;
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
