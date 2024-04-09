<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import FullscreenLoader from '@/components/FullscreenLoader.vue';
import router from '@/router';

const route = useRoute();
const toolbar = useToolbar();

const allowedPrevPath = new RegExp('^/timetable/\\d');

toolbar.setup({
	title: 'Событие',
	backUrl:
		router.options.history.state.back &&
		allowedPrevPath.test(router.options.history.state.back.toString())
			? undefined
			: '/timetable',
	backable: true,
	share: true,
});
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncContent :id="+route.params.id" />

			<template #fallback> <FullscreenLoader /> </template>
		</Suspense>
	</IrdomLayout>
</template>
