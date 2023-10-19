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
	border-radius: 10px !important;
	width: 800px;
	max-width: 800px;
	display: flex;
	padding: 12px 16px;
	gap: 12px;
}

.button-exit {
	border-radius: 10px !important;
	color: red !important;
	width: 800px;
	max-width: 800px;
	display: flex;
	padding: 12px 16px;
	gap: 12px;
}

.buttons {
	color: #f2f2f2 !important;
	margin: 10px auto 0;
	display: grid;
	flex-direction: column;
	gap: 20px;
}
</style>
