<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted, computed } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { AuthApi } from '@/api';
import { SessionInfo } from '@/api/auth';

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
	AuthApi.getMe([
		SessionInfo.AuthMethods,
		SessionInfo.Groups,
		SessionInfo.IndirectGroups,
		SessionInfo.SessionScopes,
		SessionInfo.UserScopes,
	]);
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

		<!-- <div class="buttons">
			<IrdomAuthButton v-for="button of authButtons" :key="button.name" :button="button" />
		</div> -->
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
</style>
