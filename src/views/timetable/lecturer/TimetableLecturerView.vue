<script setup lang="ts">
import AsyncLecturerInfo from './AsyncLecturerInfo.vue';
import AsyncLecturerSchedule from './AsyncLecturerSchedule.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Преподаватель',
	backUrl: '/timetable',
	share: true,
});
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncLecturerInfo :id="+route.params.id" />
			<template #fallback> Загрузка... </template>
		</Suspense>

		<b class="date"
			>Сегодня, {{ new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }) }}</b
		>
		<Suspense>
			<AsyncLecturerSchedule :id="+route.params.id" />
			<template #fallback>Загрузка...</template>
		</Suspense>
	</IrdomLayout>
</template>

<style scoped>
.date {
	font-size: 20px;
	margin-bottom: 16px;
}
</style>
