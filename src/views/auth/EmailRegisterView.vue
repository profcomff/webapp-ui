<script setup lang="ts">
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import IrdomAuthButton from '@/components/IrdomAuthButton.vue';
import { authButtons } from '@/constants/authButtons';
import { useToolbar } from '@/store/toolbar';
import RegistrationForm from '@/components/RegistrationForm.vue';

const router = useRouter();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Регистрация',
	backUrl: '/auth',
});
</script>

<template>
	<IrdomLayout>
		<div class="container">
			<div class="d-flex flex-column">
				<RegistrationForm />
				<div class="buttons">
					<IrdomAuthButton
						v-for="i in 3"
						:key="authButtons[i - 1].name"
						type="button"
						:button="authButtons[i - 1]"
						class="button"
					/>
					<v-btn
						prepend-icon="more_horiz"
						class="button"
						color="#fff"
						@click="router.push('/auth/register-all')"
						>Другие сервисы</v-btn
					>
				</div>
			</div>
			<div>
				<div class="link-text-politics">
					При регистрации и входе вы соглашаетесь
					<RouterLink to="/apps/browser#https://pages.profcomff.com/tvoy_ff_privacy_policy"
						>с политикой обработки данных</RouterLink
					>
				</div>
			</div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}

.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
	border-radius: 8px !important;
}
</style>
