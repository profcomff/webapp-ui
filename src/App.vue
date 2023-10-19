<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IrdomNavbar, IrdomToastList, NavbarItem } from './components';
import { useProfileStore, useTimetableStore } from './store';
import { marketingApi } from './api/marketing';

const profileStore = useProfileStore();
const { updateToken, updateTokenScopes, updateMarketingId } = profileStore;
const { updateGroup } = useTimetableStore();

const navbarItems = computed<NavbarItem[]>(() => {
	const common = [
		{
			icon: 'calendar_month',
			name: 'Расписание',
			path: ['/timetable'],
		},
		{
			icon: 'dashboard',
			name: 'Сервисы',
			path: ['/apps'],
		},
		{
			icon: 'account_circle',
			name: 'Профиль',
			path: ['/profile', '/auth'],
		},
	];
	// if (profileStore.isAdmin) {
	// 	common.push({
	// 		icon: 'manage_accounts',
	// 		name: 'Админка',
	// 		path: ['/admin'],
	// 	});
	// }
	return common;
});

onMounted(async () => {
	updateToken();
	updateGroup();
	updateTokenScopes();
	await updateMarketingId();
	if (profileStore.marketingId) {
		marketingApi.writeAction({
			action: 'app loaded',
			user_id: profileStore.marketingId,
		});
	}
});
</script>
<template>
	<v-app>
		<RouterView />
		<IrdomToastList />
		<IrdomNavbar :items="navbarItems" />
	</v-app>
</template>
