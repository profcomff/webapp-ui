<script setup lang="ts">
import { onMounted } from 'vue';
import { marketingApi } from './api/marketing';
import { useProfileStore } from './store/profile';
import { useTimetableStore } from './store/timetable';
import { navbarItems } from './constants/navbarItems';
import IrdomNavbar from './components/IrdomNavbar.vue';
import IrdomToastList from './components/IrdomToastList.vue';

const profileStore = useProfileStore();
const { updateToken, updateTokenScopes, updateMarketingId } = profileStore;
const { updateGroup } = useTimetableStore();

onMounted(async () => {
	updateToken();
	updateGroup();
	updateTokenScopes();
	await updateMarketingId();
	if (profileStore.marketingId) {
		marketingApi.writeAction({
			action: 'app loaded',
			user_id: profileStore.marketingId
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
