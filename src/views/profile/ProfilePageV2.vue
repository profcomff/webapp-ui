<script setup lang="ts">
import { VuConfig } from '@profcomff/ui-kit';
import UserInfo from '@/modules/profile/ui/UserInfo.vue';
import UserHeader from '@/modules/profile/ui/UserHeader.vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { onMounted, ref } from 'vue';
import { apiClient, AuthApi, UserdataApi } from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { UserdataArray, UserdataCategoryName, UserdataParams } from '@/models';
// import UserAchievements from '@/modules/profile/ui/UserAchievements.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useProfileStore } from '@/store/profile';
import { UserdataConverter } from '@/utils/UserdataConverter';
import { ToolbarActionItem } from '@/components/IrdomToolbar.vue';
import { useToolbar } from '@/store/toolbar';

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
	Error = 3,
}

const userdata = ref<UserdataArray>([]);
const userdataLoadingState = ref<UserdataLoadingState>(UserdataLoadingState.Loading);
const fullName = ref('');
const photoUrl = ref('');

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
			photoUrl.value =
				data.items.find(
					item =>
						item.category === UserdataCategoryName.PersonalInfo &&
						item.param === UserdataParams.Photo
				)?.value ?? Placeholder;

			userdata.value = UserdataConverter.flatToArray(data);
			userdataLoadingState.value = UserdataLoadingState.Ready;
		} else {
			fullName.value = 'Безымянный';
			photoUrl.value = Placeholder;
			userdataLoadingState.value = UserdataLoadingState.Error;
		}
	}
};

onMounted(async () => {
	loadUserdata();
});
</script>

<template>
	<v-theme-provider :class="VuConfig">
		<v-defaults-provider :defaults="VuConfig.defaults">
			<IrdomLayout
				:toolbar-actions="toolbarAction"
				title="Профиль"
				class-name="profile-toolbar"
				centered-toolbar
			>
				<div class="pa-3">
					<UserHeader :user-name="fullName" :photo-url="photoUrl" />

					<!-- <div class="py-9">
						<UserAchievements />
					</div> -->

					<div v-if="userdataLoadingState === UserdataLoadingState.Ready">
						<h2 class="mb-3 mt-4">Основная информация</h2>
						<div v-for="{ name, data } of userdata" :key="name" class="mb-4">
							<UserInfo :name="name" :data="data" />
						</div>
					</div>

					<FullscreenLoader v-else-if="userdataLoadingState === UserdataLoadingState.Loading" />
					<h2 v-else>Не удалось загрузить данные профиля</h2>
				</div>
			</IrdomLayout>
		</v-defaults-provider>
	</v-theme-provider>
</template>
