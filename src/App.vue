<script setup lang="ts">
import { onMounted } from 'vue';
import { IrdomNavbar, NavbarItem } from './components';
import { useProfileStore, useTimetableStore } from './store';

const navbarItems: NavbarItem[] = [
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
const { updateToken, updateTokenScopes } = useProfileStore();
const { updateGroup } = useTimetableStore();

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
