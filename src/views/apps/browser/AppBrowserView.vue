<script setup lang="ts">
import { IrdomToolbar } from '@/components';
import { useProfileStore } from '@/store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const back =
	history.state.back?.startsWith('/apps') || history.state.back?.startsWith('/timetable')
		? history.state.back
		: '/apps';

const profileStore = useProfileStore();
const route = useRoute();
const url = computed(() => {
	const u = new URL(route.hash.slice(1));
	if (profileStore.marketingId) {
		u.searchParams.append('marketing_id', profileStore.marketingId.toString());
	}
	return u.toString();
});
</script>

<template>
	<IrdomToolbar backable :back="back" :title="(route.query.title as string) ?? undefined" />
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
