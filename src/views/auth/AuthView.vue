<!-- Страница со списком основных методов входа -->
<script setup lang="ts">
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import LoginForm from '@/components/LoginForm.vue';
import RegistrationForm from '@/components/RegistrationForm.vue';
import ForgotPassordForm from '@/components/ForgotPassordForm.vue';
import IrdomAuthButton from '@/components/IrdomAuthButton.vue';
import { authButtons } from '@/constants/authButtons';
import { ref } from 'vue';

const toolbar = useToolbar();

enum Step {
	Login = 1,
	Register = 2,
	ResetPassword = 3,
}

const registerStep = ref(Step.Login);
const showButtonsCnt = ref(3);
const showMoreButton = ref(true);

async function clickShowMoreHandler() {
	showMoreButton.value = false;
	showButtonsCnt.value = authButtons.length;
}

// TODO: Разделить на 3 экрана
const switchState = async (to: Step) => {
	registerStep.value = to;
	if (registerStep.value == Step.Login) {
		toolbar.setup({ title: 'Вход в профиль' });
	} else if (registerStep.value == Step.Register) {
		toolbar.setup({ title: 'Регистрация' });
	} else if (registerStep.value == Step.ResetPassword) {
		toolbar.setup({ title: 'Восстановление пароля' });
	}
};

toolbar.setup({ title: 'Вход в профиль' });
</script>

<template>
	<IrdomLayout class="container">
		<RegistrationForm
			v-if="registerStep == Step.Register"
			class="loginform"
			@success="switchState(Step.Login)"
		/>
		<LoginForm
			v-if="registerStep == Step.Login"
			class="loginform"
			@reset-password="switchState(Step.ResetPassword)"
		/>
		<ForgotPassordForm
			v-if="registerStep == Step.ResetPassword"
			class="loginform"
			@success="switchState(Step.Login)"
		/>

		<div class="oauth-button-list">
			<IrdomAuthButton
				v-for="i in showButtonsCnt"
				:key="authButtons[i - 1].name"
				type="button"
				:button="authButtons[i - 1]"
				variant="flat"
				size="large"
				class="oauth-button"
			/>
			<v-btn
				v-if="showMoreButton"
				variant="flat"
				class="oauth-button"
				size="large"
				color="#cccccc"
				prepend-icon="more_horiz"
				@click="clickShowMoreHandler"
			>
				Другие сервисы
			</v-btn>
		</div>

		<div>
			<div v-if="registerStep == Step.Login" class="link-text-register">
				Еще нет профиля?
				<v-btn variant="plain" @click="switchState(Step.Register)">Зарегистрируйтесь</v-btn>
			</div>
			<div v-else class="link-text-register">
				Уже есть профиль?
				<v-btn variant="plain" @click="switchState(Step.Login)">Перейти к входу</v-btn>
			</div>
			<div class="link-text-politics">
				При регистрации и входе вы соглашаетесь
				<a href="https://pages.profcomff.com/tvoy_ff_privacy_policy" target="_blank">
					с политикой обработки данных
				</a>
			</div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
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

.loginform {
	width: 100%;
	max-width: 700px;
}

.container {
	justify-content: space-between;
	align-items: center;
}

.oauth-button-list {
	display: flex;
	place-content: flex-start space-around;
	align-self: center;
	flex-wrap: wrap;
	flex: 1 1 100%;
	gap: 16px;
	margin: 32px;
	width: 100%;
	max-width: 700px;
}

.oauth-button {
	min-width: 250px;
	width: 40%;
	border-radius: 4px !important;
	overflow: hidden;
}
</style>
