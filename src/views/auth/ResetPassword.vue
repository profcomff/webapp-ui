<script setup lang="ts">
import { IrdomLayout } from '@/components';
import { useRoute, useRouter } from 'vue-router';
import { AuthApi } from '@/api';

const route = useRoute();
const router = useRouter();

const submitHandler = async (event: Event) => {
	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	const new_password = formData.get('new-password')?.toString();
	if (new_password) {
		if (route.query.token) {
			const response = await AuthApi.resetPassword(new_password, route.query.token as string);
			if (response) {
				router.push('/auth');
			}
		}
	}
};
</script>

<template>
	<IrdomLayout title="Восстановление доступа">
		<div class="container">
			<div>
				<form class="form" @submit.prevent="submitHandler">
					<div class="container">
						<v-text-field
							type="password"
							name="new-password"
							autocomplete="new-password"
							class="input"
							density="compact"
							required
							variant="outlined"
							label="Новый пароль"
						/>
						<v-btn type="submit" class="submit" color="#fff"> Восстановить аккаунт </v-btn>
					</div>
				</form>
			</div>
			<div>
				<div class="link-text-register">
					Еще нет профиля? <RouterLink to="/auth/register-email">Зарегистрируйтесь</RouterLink>
				</div>
				<div class="link-text-politics">
					При регистрации и входе вы соглашаетесь
					<RouterLink to="/auth/politics">с политикой обработки данных</RouterLink>
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
