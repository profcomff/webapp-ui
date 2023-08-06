<script setup lang="ts">
import { EmailPasswordForm, IrdomLayout, SubmitData } from '@/components';
import { AuthApi } from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const submitHandler = async ({ email, password }: SubmitData) => {
	const response = await AuthApi.registerEmail(email, password);
	if (response) {
		router.push('/auth/all');
	}
};
</script>

<template>
	<IrdomLayout title="Регистрация" backable back="/auth/all">
		<EmailPasswordForm mode="register" @submit="submitHandler" />
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
