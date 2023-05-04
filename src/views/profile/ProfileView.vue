<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem, IrdomAuthButton, TelegramButton } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { AuthApi } from '@/api';
import { AuthMethod, SessionInfo } from '@/api/auth';
import { authButtons } from '@/constants';

const profileStore = useProfileStore();

const toolbarMenu = computed<ToolbarMenuItem[]>(() => {
	const arr: ToolbarMenuItem[] = [];
	if (profileStore.isUserLogged) {
		arr.push({
			name: 'Выход',
			onClick: AuthApi.logout,
		});
	}

	return arr;
});

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;
	}
	await AuthApi.getMe([
		SessionInfo.AuthMethods,
		SessionInfo.Groups,
		SessionInfo.IndirectGroups,
		SessionInfo.SessionScopes,
		SessionInfo.UserScopes,
	]);
});

const canLinked = computed(() =>
	authButtons.filter(({ method }) => !profileStore.authMethods?.includes(method) && method !== AuthMethod.Telegram),
);
const canUnlinked = computed(() => authButtons.filter(({ method }) => profileStore.authMethods?.includes(method)));
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль">
		<img :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />

		<section>
			<h2 class="link-acc">Привязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canLinked" :key="button.method" :button="button" />
				<TelegramButton />
			</div>
		</section>

		<section v-if="profileStore.authMethods && profileStore.authMethods.length > 1">
			<h2 class="link-acc">Отвязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canUnlinked" :key="button.method" :button="button" unlink />
			</div>
		</section>
	</IrdomLayout>
</template>

<style scoped>
.li {
	list-style-position: inside;

	&::marker {
		content: '- ';
	}
}

.ul {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.avatar {
	align-self: center;
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 256px;
	border-radius: 999px;
	box-shadow: 0 0 20px oklch(0 0 0 / 10%);
	object-fit: cover;
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.link-acc {
	margin-bottom: 20px;
}
</style>
