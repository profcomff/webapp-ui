<!-- Страница со списком основных методов входа -->
<script setup lang="ts">
import { IrdomLayout, SubmitData, EmailPasswordForm, IrdomAuthButton } from '@/components';
import { AuthApi } from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { authButtons } from '@/constants';
const router = useRouter();
const route = useRoute();

const submitHandler = async ({ email, password }: SubmitData) => {
	const response = await AuthApi.loginEmail(email, password);
	if (response) {
		router.push('/profile');
	}
};
</script>

<template>
	<IrdomLayout title="Вход в профиль">
		<div class="container">
			<div>
				<EmailPasswordForm mode="login" @submit="submitHandler" />
				<div class="buttons">
					<IrdomAuthButton
						v-for="i in 3"
						:key="authButtons[i - 1].name"
						type="button"
						:button="authButtons[i - 1]"
						class="button"
					/>
					<v-btn prepend-icon="more_horiz" class="button" color="#fff" @click="router.push('/auth/all')"
						>Другие сервисы</v-btn
					>
				</div>
				<div v-if="route.query.plan" class="restore">
					На вашу почту отправлено письмо для восстановления доступа к аккаунту
				</div>
			</div>
			<div>
				<div class="link-text-register">
					Еще нет профиля? <RouterLink to="/auth/register-email">Зарегистрируйтесь</RouterLink>
				</div>
				<div class="link-text-politics">
					При регистрации и входе вы соглашаетесь
					<a href="https://pages.profcomff.com/tvoy_ff_privacy_policy">с политикой обработки данных</a>
				</div>
			</div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.restore {
	color: #f19035;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
	margin: 0 auto;
	text-align: center;
}

.link-text-register {
	color: #18185c;
	margin: 0 auto;
	text-align: center;
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;

	& a {
		font-weight: 700;
	}
}

.link-text-politics {
	margin: 0 auto;
	color: #807ea4;
	text-align: center;
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;

	& a {
		text-decoration-line: underline;
	}
}

.buttons {
	margin: 30px auto;
	grid-template-columns: 1fr 1fr;
	display: grid;
	gap: 16px;
	max-width: 400px;
}

.button {
	overflow-x: hidden;
	border-radius: 8px !important;
}

.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
