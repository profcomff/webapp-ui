<script setup lang="ts">
import { AuthMethod, authEmailApi } from '@/api/auth';
import { EmailPasswordForm, IrdomAuthButton, IrdomLayout, SubmitData } from '@/components';
import TelegramButon from '@/components/TelegramButon.vue';
import { authButtons } from '@/constants';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useProfileStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();
const profileStore = useProfileStore();

const submitHandler = async (body: SubmitData) => {
	const { data } = await authEmailApi.login(body);

	LocalStorage.set(LocalStorageItem.Token, data.token);
	profileStore.updateToken();

	router.push('/profile');
};
</script>

<template>
	<IrdomLayout title="Все способы входа" backable back="/auth">
		<EmailPasswordForm mode="login" @submit="submitHandler" />
		<RouterLink to="/auth/register-email" class="link">Регистрация по электронной почте</RouterLink>

		<div class="buttons">
			<IrdomAuthButton
				v-for="button of authButtons.filter(({ method }) => method !== AuthMethod.Telegram)"
				:key="button.name"
				:button="button"
			/>
			<TelegramButon />
			<div ref="telegram"></div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.link {
	width: fit-content;
	display: block;
	margin: 0 auto 64px;
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}
</style>
