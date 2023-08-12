<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem, IrdomAuthButton, TelegramButton } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted, computed, ref } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { AuthApi } from '@/api';
import { AuthMethod, MySessionInfo } from '@/api/auth';
import { authButtons } from '@/constants';
import { useRouter } from 'vue-router';
import { UserdataApi } from '@/api/controllers/UserdataApi';
import { UserdataConverter } from '@/utils';
import { UserdataArray } from '@/models';

const profileStore = useProfileStore();
const router = useRouter();

const userdata = ref<UserdataArray>([]);
const userdataLoading = ref(false);
const fullName = ref('');

const toolbarMenu: ToolbarMenuItem[] = [
	{
		name: 'Выход',
		onClick: async () => {
			await AuthApi.logout();
			router.push('/auth');
		},
	},
	{
		name: 'Сессии',
		onClick: () => router.push('/profile/sessions'),
	},
];

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;
	}

	userdataLoading.value = true;
	const { data: me } = await AuthApi.getMe([
		MySessionInfo.AuthMethods,
		MySessionInfo.Groups,
		MySessionInfo.IndirectGroups,
		MySessionInfo.SessionScopes,
		MySessionInfo.UserScopes,
	]);

	const { data } = await UserdataApi.getUser(me.id);

	userdata.value = UserdataConverter.flatToArray(data);
	fullName.value = UserdataConverter.getFullName(data);

	userdataLoading.value = false;
});

const canLinked = computed(() =>
	authButtons.filter(({ method }) => !profileStore.authMethods?.includes(method) && method !== AuthMethod.Telegram),
);
const canUnlinked = computed(() => authButtons.filter(({ method }) => profileStore.authMethods?.includes(method)));
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль" class="personal">
		<img :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />
		<section class="user-info">
			<h1>
				{{ fullName }}
			</h1>
		</section>
		<div v-if="userdataLoading">Загрузка...</div>
		<div v-else class="userdata">
			<div v-for="{ name, data } of userdata" :key="name">
				<section class="section">
					<h2>
						{{ name }}
					</h2>
					<div v-for="{ param, value } of data" :key="param" class="userdata-param">
						<div>
							{{ param }}
						</div>
						<h3>
							{{ value }}
						</h3>
					</div>
				</section>
			</div>
		</div>

		<section v-if="profileStore.authMethods?.length !== 8" class="section">
			<h2>Привязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canLinked" :key="button.method" :button="button" />
				<TelegramButton v-if="!profileStore.authMethods?.includes(AuthMethod.Telegram)" />
			</div>
		</section>

		<section v-if="profileStore.authMethods && profileStore.authMethods.length > 1" class="section">
			<h2>Отвязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canUnlinked" :key="button.method" :button="button" unlink />
			</div>
		</section>
	</IrdomLayout>
</template>

<style scoped>
.avatar {
	align-self: center;
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 256px;
	border-radius: 999px;
	object-fit: cover;
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.section {
	margin-bottom: 40px;

	& h2 {
		margin-bottom: 20px;
	}
}

.userdata {
	margin-left: 100px;
}

.userdata-category {
	margin-bottom: 3%;
}

.userdata-param {
	margin-bottom: 10px;
	margin-top: 10px;
}

.user-info {
	display: inline-block;
	align-self: center;
	margin-bottom: 4%;
}

.personal {
	height: 50%;
}
</style>
