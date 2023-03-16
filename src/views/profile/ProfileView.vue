<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem } from '@/components';
import { MeInfo, authProfileApi } from '@/api/auth';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Placeholder from '@/assets/profile_image_placeholder.webp';

const profileStore = useProfileStore();
const { updateToken, updateTokenScopes } = profileStore;
const router = useRouter();

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

	if (profileStore.isAdmin) {
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
		>([MeInfo.TokenScopes, MeInfo.IndirectGroups, MeInfo.Groups, MeInfo.UserScopes]);

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
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 256px;
	border-radius: 999px;
	box-shadow: 0 0 20px rgb(0 0 0 / 10%);
	object-fit: cover;
}
</style>
