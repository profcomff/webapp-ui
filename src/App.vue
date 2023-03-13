<script setup lang="ts">
import { IrdomNavbar, NavbarItem } from './components';

const navbarItems: NavbarItem[] = [
	{
		icon: 'calendar_month',
		name: 'Расписание',
		path: '/timetable',
	},
	{
		icon: 'apps',
		name: 'Сервисы',
		path: '/apps',
	},
	{
		icon: 'account_circle',
		name: 'Профиль',
		path: '/profile',
	},
];
</script>
<template>
	<RouterView />
	<IrdomNavbar :items="navbarItems" />
</template>
<style scoped></style>
