<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import apiClient, { AuthApi, UserdataApi } from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { UserdataArray, UserdataCategoryName, UserdataParams } from '@/models';
import AchievementsSlider from './achievement/AchievementsSlider.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useProfileStore } from '@/store/profile';
import { UserdataConverter } from '@/utils/UserdataConverter';
import { ToolbarActionItem } from '@/components/IrdomToolbar.vue';
import { useToolbar } from '@/store/toolbar';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();
const toolbar = useToolbar();

const isOwnProfile = !('id' in route.params) || route.params.id === undefined;

const buttons: ToolbarActionItem[] = [];

if (isOwnProfile) {
	buttons.push({
		icon: 'settings',
		ariaLabel: 'Настройки',
		onClick: () => router.push('/profile/settings'),
	});
}

toolbar.setup({
	title: 'Профиль',
	actions: buttons,
});

enum UserdataLoadingState {
	Loading = 1,
	Ready = 2,
}

const userdata = ref<UserdataArray>([]);
const userdataLoadingState = ref<UserdataLoadingState>(UserdataLoadingState.Loading);
const fullName = ref('');
const photoURL = ref('');

const toolbarAction: ToolbarActionItem[] = [
	{
		icon: 'edit',
		ariaLabel: 'Редактировать профиль',
		onClick: () => router.push('/profile/edit'),
	},
	{
		icon: 'settings',
		ariaLabel: 'Настройки',
		onClick: () => router.push('/profile/settings'),
	},
];

const loadUserdata = async () => {
	if (!profileStore.token) {
		await apiClient.GET('/auth/me');
	}

	userdataLoadingState.value = UserdataLoadingState.Loading;

	const { data: me } = await (isOwnProfile
		? AuthApi.getMe(['auth_methods', 'groups', 'indirect_groups', 'session_scopes', 'user_scopes'])
		: AuthApi.getById(Number(route.params.id), [
				'auth_methods',
				'groups',
				'indirect_groups',
				'scopes',
			]));

	if (me) {
		const { data } = await UserdataApi.getUser(me.id);
		if (data) {
			fullName.value =
				data.items.find(
					item =>
						item.category === UserdataCategoryName.PersonalInfo &&
						item.param === UserdataParams.FullName
				)?.value ?? 'Безымянный';
			photoURL.value =
				data.items.find(
					item =>
						item.category === UserdataCategoryName.PersonalInfo &&
						item.param === UserdataParams.Photo
				)?.value ?? Placeholder;

			userdata.value = UserdataConverter.flatToArray(data);

			userdataLoadingState.value = UserdataLoadingState.Ready;
		}
	}
};

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;
	}

	loadUserdata();
});
</script>

<template>
	<IrdomLayout
		:toolbar-actions="toolbarAction"
		title="Профиль"
		class-name="profile-toolbar"
		centered-toolbar
	>
		<img
			v-if="userdataLoadingState == UserdataLoadingState.Ready"
			:src="photoURL"
			alt="Аватар"
			width="400 "
			height="400"
			class="avatar"
		/>
		<img v-else :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />

		<span class="user-name">
			{{ fullName }}
		</span>
		<section v-if="profileStore.id !== null" class="section">
			<h2>Достижения</h2>
			<AchievementsSlider :user-id="profileStore.id" />
		</section>
		<section class="section">
			<h2>Основная информация</h2>
			<FullscreenLoader v-if="userdataLoadingState == UserdataLoadingState.Loading" />
			<div v-else-if="userdataLoadingState == UserdataLoadingState.Ready">
				<div v-for="{ name, data } of userdata" :key="name" class="userdata-section">
					<div class="userdata-category">
						{{ name }}
					</div>
					<div v-for="{ param, value } of data" :key="param">
						<div class="userdata-param">
							{{ param }}
						</div>
						<div class="userdata-value">
							{{ value.name }}
						</div>
					</div>
				</div>
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
	text-align: center;
	display: inline-block;
	align-self: center;
	color: #000;
	font-kerning: none;
	font-size: 32px;
	font-weight: 700;
	line-height: 35px;
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
