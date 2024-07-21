<script setup lang="ts">
import { AuthApi } from '@/api';
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import { onMounted, ref } from 'vue';
import { MySessionInfo } from '@/api/auth';

const router = useRouter();
const toolbar = useToolbar();
const current_email = ref();

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

toolbar.setup({
	title: 'Настройки профиля',
	backUrl: '/profile',
});

const OnClick = async () => {
	await AuthApi.logout();
	router.push('/auth');
};
</script>

<template>
	<IrdomLayout>
		<div class="buttons">
			<v-btn
				prepend-icon="login"
				variant="tonal"
				class="button"
				@click="$router.push('/profile/edit-auth')"
			>
				Методы входа
			</v-btn>
			<v-btn
				prepend-icon="mail"
				variant="tonal"
				class="button"
				:disabled="!current_email"
				@click="$router.push('/profile/change-email')"
			>
				Изменение почты
			</v-btn>
			<v-btn
				prepend-icon="mail"
				variant="tonal"
				class="button"
				:disabled="current_email"
				@click="$router.push('/profile/add-email')"
			>
				Добавление почты
			</v-btn>
			<v-btn
				prepend-icon="key"
				variant="tonal"
				class="button"
				:disabled="!current_email"
				@click="$router.push('/profile/change-password')"
			>
				Изменение пароля
			</v-btn>
			<v-btn
				prepend-icon="history"
				variant="tonal"
				class="button"
				@click="$router.push('/profile/sessions')"
			>
				Текущие сессии
			</v-btn>
			<v-btn variant="tonal" class="button" color="red" @click="OnClick">Выход</v-btn>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.button {
	width: 100%;
	max-width: 600px;
	display: flex;
	text-align: center;
	padding: 12px 16px;
	gap: 12px;
	margin: 0 auto;
}

.buttons {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
}
</style>
