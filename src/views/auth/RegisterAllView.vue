<script setup lang="ts">
import { AuthMethod } from '@/api/auth';
import { IrdomAuthButton, IrdomLayout } from '@/components';
import TelegramButon from '@/components/TelegramButon.vue';
import { authButtons } from '@/constants';
</script>

<template>
	<IrdomLayout title="Все способы регистрации" backable back="/auth">
		<div class="container">
			<div>
				<div class="buttons">
					<IrdomAuthButton
						v-for="button of authButtons.filter(({ method }) => method !== AuthMethod.Telegram)"
						:key="button.name"
						:button="button"
						class="button"
					/>
					<TelegramButon class="button" />
					<div ref="telegram"></div>
				</div>
				<hr class="line" />
				<div class="email-login">
					<RouterLink to="/auth/register-email">Зарегистрироваться по электронной почте</RouterLink>
				</div>
			</div>
			<div>
				<div class="link-text-politics">
					При регистрации и входе вы соглашаетесь
					<a href="https://pages.profcomff.com/tvoy_ff_privacy_policy">с политикой обработки данных</a>
				</div>
			</div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.line {
	margin: 0 auto;
	align-self: center !important;
	width: 320px;
	border-width: 1px;
	border-color: black;
}

.email-login {
	color: #18185c;
	font-size: 18px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;
	margin-top: 15px;
	text-align: center !important;
	align-self: center !important;
}

.button {
	border-radius: 8px !important;
}

.buttons {
	margin: 30px auto 0;
	grid-template-columns: 200px 200px;
	display: grid;
	gap: 16px;
	max-width: 400px;
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

.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
