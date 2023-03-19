<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem } from '@/components';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import {
	authPhysicsApi,
	authLkmsuApi,
	authMymsuApi,
	authYandexApi,
	authGoogleApi,
	authVkApi,
	authGithubApi,
	AuthOauth2BaseApi,
	authProfileApi,
	MeInfo,
} from '@/api/auth';

const profileStore = useProfileStore();
const { updateToken, updateTokenScopes } = profileStore;

const logout = async () => {
	if (profileStore.isUserLogged) {
		await authProfileApi.logout();
		LocalStorage.delete(LocalStorageItem.Token);
		LocalStorage.delete(LocalStorageItem.TokenScopes);
		location.reload();
	}
};

const toolbarMenu = computed<ToolbarMenuItem[]>(() => {
	const arr: ToolbarMenuItem[] = [];
	if (profileStore.isUserLogged) {
		arr.push({
			name: 'Выход',
			onClick: logout,
		});
	}

	if (import.meta.env.VITE_APP_VERSION) {
		arr.push({
			name: 'О приложении',
			onClick: () => alert(`Версия приложения: ${import.meta.env.VITE_APP_VERSION}`),
		});
	}

	return arr;
});

async function openAddMethodUrl(api: AuthOauth2BaseApi) {
	const url = await api.getAuthUrl();
	window.open(url, '_blank');
}

onMounted(async () => {
	if (history.state.token) {
		updateToken(history.state.token);
		delete history.state.token;
	}
	if (!profileStore.tokenScopes || !profileStore.indirectGroups || !profileStore.groups) {
		const { data } = await authProfileApi.getMe<
			MeInfo.TokenScopes | MeInfo.IndirectGroups | MeInfo.Groups | MeInfo.UserScopes
		>([MeInfo.TokenScopes, MeInfo.IndirectGroups, MeInfo.Groups, MeInfo.UserScopes]);

		profileStore.indirectGroups = data.indirect_groups;
		profileStore.groups = data.groups;
		profileStore.userScopes = data.user_scopes.map(s => s.name);

		LocalStorage.set<string[]>(
			LocalStorageItem.TokenScopes,
			data.session_scopes.map(s => s.name),
		);
		updateTokenScopes();
	}
});
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль">
		<img :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />

		<ul class="ul">
			<b>Indirect groups</b>
			<template v-if="profileStore.indirectGroups?.length">
				<li v-for="g of profileStore.indirectGroups" :key="g" class="li">
					{{ g }}
				</li>
			</template>
			<template v-else><p>No indirect groups</p></template>
		</ul>

		<ul class="ul">
			<b>Groups</b>
			<template v-if="profileStore.groups?.length">
				<li v-for="g of profileStore.groups" :key="g" class="li">
					{{ g }}
				</li>
			</template>
			<template v-else><p>No groups</p></template>
		</ul>

		<ul class="ul">
			<b>User scopes</b>
			<template v-if="profileStore.userScopes?.length">
				<li v-for="s of profileStore.userScopes" :key="s" class="li">
					{{ s }}
				</li>
			</template>
			<template v-else><p>No user scopes</p></template>
		</ul>

		<ul class="ul">
			<b>Token scopes</b>
			<template v-if="profileStore.tokenScopes?.length">
				<li v-for="s of profileStore.tokenScopes" :key="s" class="li">
					{{ s }}
				</li>
			</template>
			<template v-else><p>No session scopes</p></template>
		</ul>

		<button type="button" @click="openAddMethodUrl(authPhysicsApi)" class="link">
			Добавить вход с почтой @physics.msu.ru
		</button>
		<button type="button" @click="openAddMethodUrl(authMymsuApi)" class="link">
			Добавить вход с почтой @my.msu.ru
		</button>
		<button type="button" @click="openAddMethodUrl(authLkmsuApi)" class="link">Добавить вход через ЛК МГУ</button>
		<button type="button" @click="openAddMethodUrl(authGoogleApi)" class="link">
			Добавить вход через аккаунт Google
		</button>
		<button type="button" @click="openAddMethodUrl(authYandexApi)" class="link">
			Добавить вход через аккаунт Yandex
		</button>
		<button type="button" @click="openAddMethodUrl(authVkApi)" class="link">Добавить вход через аккаунт ВК</button>
		<button type="button" @click="openAddMethodUrl(authGithubApi)" class="link">
			Добавить вход через аккаунт Github
		</button>
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

.link {
	align-self: flex-start;
}
</style>
