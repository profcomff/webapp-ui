<script setup lang="ts">
import { useProfileStore, useTimetableStore } from './store';
import { marketingApi } from './api/marketing';
import { navbarItems } from '@/constants';

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
