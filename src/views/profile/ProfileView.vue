<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem } from '@/components';
import { MeInfo, authProfileApi } from '@/api/auth';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Placeholder from '@/assets/profile_image_placeholder.webp';

const profileStore = useProfileStore();
const { isUserLogged, updateToken, updateTokenScopes, isAdmin } = profileStore;
const router = useRouter();

const logout = async () => {
	if (isUserLogged()) {
		await authProfileApi.logout();
		LocalStorage.delete(LocalStorageItem.Token);
		LocalStorage.delete(LocalStorageItem.TokenScopes);
		updateToken();
		updateTokenScopes();
	}
};

const toolbarMenu = computed<ToolbarMenuItem[]>(() => {
	const arr: ToolbarMenuItem[] = [];
	if (isUserLogged()) {
		arr.push({
			name: 'Выход',
			onClick: logout,
		});
	}

	if (isAdmin()) {
		arr.push({
			name: 'Админка',
			onClick: () => router.push('/admin'),
		});
	}

	return arr;
});

onMounted(async () => {
	if (history.state.token) {
		updateToken(history.state.token);
		delete history.state.token;
	}
	if (!profileStore.tokenScopes || !profileStore.indirectGroups || !profileStore.groups) {
		const { data } = await authProfileApi.getMe<
			MeInfo.TokenScopes | MeInfo.IndirectGroups | MeInfo.Groups | MeInfo.UserScopes
		>({
			info: [MeInfo.TokenScopes, MeInfo.IndirectGroups, MeInfo.Groups, MeInfo.UserScopes],
		});
		console.log('groups', data.groups);
		profileStore.indirectGroups = data.indirect_groups.map(g => g.name);
		profileStore.groups = data.groups.map(g => g.name);
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

		<ul v-if="profileStore.indirectGroups?.length" class="ul">
			<b>Indirect groups</b>
			<li v-for="g of profileStore.indirectGroups" :key="g" class="li">
				{{ g }}
			</li>
		</ul>
		<template v-else>No indirect groups</template>

		<ul v-if="profileStore.groups?.length" class="ul">
			<b>Groups</b>
			<li v-for="g of profileStore.groups" :key="g" class="li">
				{{ g }}
			</li>
		</ul>
		<template v-else>No groups</template>

		<ul v-if="profileStore.userScopes?.length" class="ul">
			<b>User scopes</b>
			<li v-for="s of profileStore.userScopes" :key="s" class="li">
				{{ s }}
			</li>
		</ul>
		<template v-else>No user scopes</template>

		<ul v-if="profileStore.tokenScopes?.length" class="ul">
			<b>Token scopes</b>
			<li v-for="s of profileStore.tokenScopes" :key="s" class="li">
				{{ s }}
			</li>
		</ul>
		<template v-else>No indirect groups</template>
	</IrdomLayout>
</template>

<style scoped>
.li {
	list-style-position: inside;
}
.li::marker {
	content: '- ';
}

.ul {
	margin-bottom: 20px;
}

.ul:last-child {
	margin-bottom: 0;
}

.avatar {
	align-self: center;
	border-radius: 999px;
	max-width: 256px;
	height: auto;
	aspect-ratio: 1;
	object-fit: cover;
}
</style>
