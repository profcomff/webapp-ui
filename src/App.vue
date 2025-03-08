<script setup lang="ts">
import { onMounted } from 'vue';
import { useProfileStore } from './store/profile';
import { useTimetableStore } from './store/timetable';
import { navbarItems } from './constants/navbarItems';
import IrdomNavbar from './components/IrdomNavbar.vue';
import IrdomToastList from './components/IrdomToastList.vue';
import { useToolbar } from './store/toolbar';
import IrdomToolbar from './components/IrdomToolbar.vue';
import CalendarDropdown from './views/timetable/CalendarDropdown.vue';
import { apiClient } from '@/api/';

const profileStore = useProfileStore();
const toolbar = useToolbar();

const { updateToken, updateTokenScopes, updateMarketingId } = profileStore;
const { updateGroup } = useTimetableStore();

onMounted(async () => {
	updateToken();
	updateGroup();
	updateTokenScopes();
	await updateMarketingId();
	if (profileStore.marketingId) {
		apiClient.POST('/marketing/v1/action', {
			body: {
				action: 'app loaded',
				user_id: profileStore.marketingId,
			},
		});
	}
});
</script>

<template>
	<v-app>
		<IrdomToolbar
			:actions="toolbar.actions"
			:menu-items="toolbar.menuItems"
			:backable="toolbar.backable"
			:back-url="toolbar.backUrl"
			:title="toolbar.title"
			:share="toolbar.share"
		>
			<CalendarDropdown
				v-if="/\d{4}-\d{2}-\d{2}/.test($route.path)"
				:date="new Date($route.params.date as string)"
			/>
		</IrdomToolbar>
		<RouterView />
		<IrdomToastList />
		<IrdomNavbar :items="navbarItems" />
	</v-app>
</template>
