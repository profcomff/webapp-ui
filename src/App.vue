<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IrdomNavbar, NavbarItem } from './components';
import { useProfileStore, useTimetableStore } from './store';

const profileStore = useProfileStore();
const { updateToken, updateTokenScopes } = profileStore;
const { updateGroup } = useTimetableStore();

const navbarItems = computed<NavbarItem[]>(() => {
	const common = [
		{
			icon: 'calendar_month',
			name: 'Расписание',
			path: '/timetable',
		},
		{
			icon: 'dashboard',
			name: 'Сервисы',
			path: '/apps',
		},
		{
			icon: 'account_circle',
			name: 'Профиль',
			path: '/profile',
		},
	];
	if (profileStore.isAdmin) {
		common.push({
			icon: 'manage_accounts',
			name: 'Админка',
			path: '/admin',
		});
	}
	return common;
});

onMounted(() => {
	updateToken();
	updateGroup();
	updateTokenScopes();
});
</script>
<template>
	<RouterView />
	<IrdomNavbar :items="navbarItems" />
</template>
