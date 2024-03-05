<script setup lang="ts">
import { AuthMethod } from '@/api/auth';
import TelegramButon from '@/components/TelegramButon.vue';
import IrdomAuthButton from '@/components/IrdomAuthButton.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { authButtons } from '@/constants/authButtons';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Все способы входа',
	backUrl: '/auth',
});
</script>

<template>
	<IrdomLayout>
		<div class="container">
			<div>
				<div class="buttons">
					<IrdomAuthButton
						v-for="button of authButtons.filter(({ method }) => method !== AuthMethod.Telegram)"
						:key="button.name"
						class="button"
						:button="button"
					/>
					<TelegramButon class="button" />
					<div ref="telegram" />
				</div>
				<hr class="line" />
				<div class="email-login">
					<RouterLink to="/auth">Войти по электронной почте</RouterLink>
				</div>
			</div>
			<div>
				<div class="link-text-register">
					Еще нет профиля? <RouterLink to="/auth/register-email">Зарегистрируйтесь</RouterLink>
				</div>
				<div class="link-text-politics">
					При регистрации и входе вы соглашаетесь
					<a href="https://pages.profcomff.com/tvoy_ff_privacy_policy"
						>с политикой обработки данных</a
					>
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
	font-weight: 400;
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

.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
