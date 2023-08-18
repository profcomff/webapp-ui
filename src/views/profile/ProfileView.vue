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
import AchievementsSlider from './achievement/AchievementsSlider.vue';

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
	fullName.value = UserdataConverter.getFullName(data);
	userdata.value = UserdataConverter.flatToArray(data);

	userdataLoading.value = false;
});

const canLinked = computed(() =>
	authButtons.filter(({ method }) => !profileStore.authMethods?.includes(method) && method !== AuthMethod.Telegram),
);
const canUnlinked = computed(() => authButtons.filter(({ method }) => profileStore.authMethods?.includes(method)));
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль" class-name="profile-toolbar">
		<img :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />

		<span class="user-name">
			{{ fullName }}
		</span>
		<section v-if="profileStore.id !== null" class="section">
			<h2>Достижения</h2>
			<AchievementsSlider :user-id="profileStore.id" />
		</section>
		<section class="section">
			<h2>Основная информация</h2>
			<div v-if="userdataLoading">Загрузка...</div>
			<div v-else>
				<div v-for="{ name, data } of userdata" :key="name" class="userdata-section">
					<div class="userdata-category">
						{{ name }}
					</div>
					<div v-for="{ param, value } of data" :key="param">
						<div class="userdata-param">
							{{ param }}
						</div>
						<div class="userdata-value">
							{{ value }}
						</div>
					</div>
				</div>
			</div>
		</section>
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
	max-width: 161px;
	border-radius: 999px;
	object-fit: cover;
	position: relative;
	z-index: 2;
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

.userdata-section {
	margin-left: 12px;
}

.userdata-category {
	color: var(--m-3-sys-light-outline, #79747e);
	font-size: 14px;
	font-weight: 900;
	line-height: 16px; /* 114.286% */
	letter-spacing: 0.5px;
	margin-top: 11px;

	&:not(:last-child) {
		margin-bottom: 11px;
	}
}

.userdata-param {
	margin-left: 11px;
	margin-bottom: 5px;
	color: var(--m-3-sys-light-outline, #79747e);
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;
	letter-spacing: 0.5px;
}

.userdata-value {
	margin-left: 11px;
	margin-bottom: 16px;
	color: var(--m-3-sys-light-on-surface, #1c1b1f);
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
	letter-spacing: 0.5px;
}

.user-name {
	margin-bottom: 32px;
	display: inline-block;
	align-self: center;
	color: #000;
	font-kerning: none;
	font-size: 32px;
	font-weight: 700;
	line-height: 20px;
	letter-spacing: 0.1px;
}

.info {
	margin-bottom: 30px;
	margin-top: 50px;
	color: #000;
	font-size: 20px;
	font-weight: 600;
	line-height: 16px; /* 80% */
	letter-spacing: 0.5px;
}
</style>
