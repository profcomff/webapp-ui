Страница со списком основных методов входа
<script setup lang="ts">
import { AuthApi } from '@/api';
import { useRouter } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const router = useRouter();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Восстановление доступа',
});

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const email = formData.get('email')?.toString();
	if (email) {
		const response = await AuthApi.requestResetForgottenPassword(email);
		if (response) {
			router.push({ path: '/auth', query: { plan: 'private' } });
		}
	}
};
</script>

<template>
	<IrdomLayout>
		<div class="container">
			<div>
				<form class="form" @submit.prevent="submitHandler">
					<div class="container">
						<v-text-field
							type="email"
							name="email"
							autocomplete="email"
							class="input"
							density="compact"
							required
							variant="outlined"
							label="Email"
						/>
						<v-btn type="submit" class="submit" color="#fff"> Восстановить пароль </v-btn>
					</div>
				</form>
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
.submit {
	width: 100%;
	max-width: 220px;
	align-self: center;
	margin: 20px auto 16px;
	border-radius: 8px !important;
}

.input {
	align-self: center;
	width: 100%;
	max-width: 400px;
	margin: 0 auto 5px;
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
