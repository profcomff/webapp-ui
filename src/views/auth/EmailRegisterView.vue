<script setup lang="ts">
import { authEmailApi } from '@/api/auth';
import { EmailPasswordForm, IrdomLayout, SubmitData } from '@/components';

const submitHandler = async (data: SubmitData) => {
	await authEmailApi.register(data);
};
</script>

<template>
	<IrdomLayout title="Вход" backable back="/auth/all">
		<EmailPasswordForm mode="register" @submit="submitHandler" />
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
