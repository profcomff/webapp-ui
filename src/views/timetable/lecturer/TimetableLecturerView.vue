<script setup lang="ts">
import AsyncLecturerInfo from './AsyncLecturerInfo.vue';
import AsyncLecturerSchedule from './AsyncLecturerSchedule.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import FullscreenLoader from '@/components/FullscreenLoader.vue';
import router from '@/router';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Преподаватель',
	backUrl:
		router.options.history.state.back &&
		router.options.history.state.back.toString().startsWith('/timetable/event')
			? undefined
			: '/timetable',
	backable: true,
	share: true,
});
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncLecturerInfo :id="+route.params.id" />
			<template #fallback> <FullscreenLoader /> </template>
		</Suspense>

		<b class="date"
			>Сегодня, {{ new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }) }}</b
		>
		<Suspense>
			<AsyncLecturerSchedule :id="+route.params.id" />
			<template #fallback><FullscreenLoader /></template>
		</Suspense>
	</IrdomLayout>
</template>

<style scoped>
.date {
	font-size: 20px;
	margin-bottom: 16px;
}
</style>
