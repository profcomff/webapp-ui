<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IrdomNavbar, NavbarItem, IrdomToastList } from './components';
import { useProfileStore, useTimetableStore, useToastStore } from './store';
import { marketingApi } from './api/marketing';
import { userSessionApi } from './api/auth';
import axios from 'axios';
import router from './router';
import { ToastType } from './models';
import { AuthApi } from './api';

const profileStore = useProfileStore();
const toastStore = useToastStore();
const { updateToken, updateTokenScopes, updateMarketingId, deleteToken } = profileStore;
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
	if (profileStore.isAdmin) {
		common.push({
			icon: 'manage_accounts',
			name: 'Админка',
			path: ['/admin'],
		});
	}
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
	<RouterView />
	<IrdomNavbar :items="navbarItems" />
	<IrdomToastList />
</template>
