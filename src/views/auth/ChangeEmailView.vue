<script setup lang="ts">
import { AuthApi } from '@/api';
import { ToastType } from '@/models';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MySessionInfo } from '@/api/auth/UserSessionApi';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToastStore } from '@/store/toast';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Изменение электронной почты',
	backUrl: '/profile/settings',
});

const checkPasswords = ref(false);
checkPasswords.value = false;
const router = useRouter();
const toastStore = useToastStore();
const current_email = ref('');

onMounted(async () => {
	const { data: me } = await AuthApi.getMe([
		MySessionInfo.AuthMethods,
		MySessionInfo.Groups,
		MySessionInfo.IndirectGroups,
		MySessionInfo.SessionScopes,
		MySessionInfo.UserScopes,
	]);
	current_email.value = me.email;
});

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	if (email) {
		const response = await AuthApi.requestResetEmail(email);
		if (response) {
			toastStore.push({
				title: 'Изменение Email',
				type: ToastType.Info,
				description: 'На вашу почту отправлено сообщение об изменении Email',
			});
			router.push('/profile');
		}
	}
};
</script>

<template>
	<IrdomLayout class="container">
		<v-form
			class="loginform d-flex flex-column w-100 align-self-center ga-4"
			@submit.prevent="submitHandler"
		>
			<div v-if="current_email" class="email">
				Текущий адрес электронной почты: <b>{{ current_email }}</b>
			</div>
			<v-text-field
				type="email"
				name="email"
				autocomplete="email"
				label="Новый адрес электронной почты"
				required
				hide-details
			/>
			<v-btn type="submit" color="primary" class="w-100">Изменить Email</v-btn>
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

.container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
