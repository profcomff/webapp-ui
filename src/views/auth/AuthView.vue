<!-- Страница со списком основных методов входа -->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { authButtons } from '@/constants/authButtons';
import IrdomLayout from '@/components/IrdomLayout.vue';
import IrdomAuthButton from '@/components/IrdomAuthButton.vue';
import { useToolbar } from '@/store/toolbar';
import LoginForm from '@/components/LoginForm.vue';
import { ref } from 'vue';

const route = useRoute();
const toolbar = useToolbar();

const showButtonsCnt = ref(3);
const showMoreButton = ref(true);

toolbar.setup({
	title: 'Вход в профиль',
});

async function clickShowMoreHandler() {
	showMoreButton.value = false;
	showButtonsCnt.value = authButtons.length;
}
</script>

<template>
	<IrdomLayout class="container">
		<LoginForm class="loginform" />
		<div class="buttons">
			<IrdomAuthButton
				v-for="i in showButtonsCnt"
				:key="authButtons[i - 1].name"
				type="button"
				:button="authButtons[i - 1]"
				variant="flat"
				size="large"
				class="button"
			/>
			<v-btn
				v-if="showMoreButton"
				variant="flat"
				class="button"
				size="large"
				color="#cccccc"
				@click="clickShowMoreHandler"
			>
				<template #prepend>
					<v-icon icon="more_horiz" />
				</template>
				Другие сервисы</v-btn
			>
		</div>
		<div v-if="route.query.plan" class="restore">
			На вашу почту отправлено письмо для восстановления доступа к аккаунту
		</div>

		<div>
			<div class="link-text-register">
				Еще нет профиля? <RouterLink to="/auth/register-email">Зарегистрируйтесь</RouterLink>
			</div>
			<div class="link-text-politics">
				При регистрации и входе вы соглашаетесь
				<RouterLink to="/apps/browser#https://pages.profcomff.com/tvoy_ff_privacy_policy"
					>с политикой обработки данных</RouterLink
				>
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

.loginform {
	width: 100%;
	max-width: 700px;
}

.buttons {
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

.container {
	justify-content: space-between;
	align-items: center;
}

.button {
	min-width: 250px;
	width: 40%;
	border-radius: 4px !important;
	overflow: hidden;
}
</style>
