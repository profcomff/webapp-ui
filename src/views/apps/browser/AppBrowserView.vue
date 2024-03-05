<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/store/profile';
import { useToolbar } from '@/store/toolbar';

const profileStore = useProfileStore();
const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: route.query.title ? String(route.query.title) : 'Твой ФФ!',
	backUrl: '/apps',
});

const url = computed(() => {
	const u = new URL(route.hash.slice(1));
	if (profileStore.marketingId) {
		u.searchParams.append('marketing_id', profileStore.marketingId.toString());
	}
	return u.toString();
});
</script>

<template>
	<v-main>
		<iframe :src="url" frameborder="0" class="iframe" allow="camera" />
	</v-main>
</template>

<style scoped>
v-main,
.iframe {
	flex: 1;
	width: 100%;
	height: 100%;
}
</style>
