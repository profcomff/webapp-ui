<script setup lang="ts">
import { AuthApi } from '@/api';
import { IrdomLayout } from '@/components';
import { useRouter } from 'vue-router';
const router = useRouter();

const OnClick = async () => {
	AuthApi.logout();
	router.push('/auth');
};
</script>

<template>
	<IrdomLayout title="Настройки профиля" backable back="/profile">
		<div class="buttons">
			<v-btn prepend-icon="login" variant="tonal" class="button" @click="$router.push('/profile/edit-auth')"
				>Методы входа</v-btn
			>
			<v-btn prepend-icon="mail" variant="tonal" class="button" @click="$router.push('/profile/change-email')"
				>Изменение почты</v-btn
			>
			<v-btn prepend-icon="key" variant="tonal" class="button" @click="$router.push('/profile/change-password')"
				>Изменение пароля</v-btn
			>
			<v-btn prepend-icon="history" variant="tonal" class="button" @click="$router.push('/profile/sessions')"
				>Текущие сессии</v-btn
			>
			<v-btn variant="tonal" class="button-exit" @click="OnClick">Выход</v-btn>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.button {
	position: relative;
	border-radius: 10px !important;
	width: 600px;
	max-width: 600px;
	display: flex;
	text-align: center;
	padding: 12px 16px;
	gap: 12px;
	margin: 0 auto;
}

.button-exit {
	border-radius: 10px !important;
	color: red !important;
	width: 600px;
	max-width: 600px;
	display: flex;
	padding: 12px 16px;
	gap: 12px;
	margin: 0 auto;
}

.buttons {
	position: relative;
	color: #f2f2f2 !important;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
}
</style>
