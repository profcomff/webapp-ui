<script setup lang="ts">
import AsyncLecturerInfo from './AsyncLecturerInfo.vue';
import AsyncLecturerSchedule from './AsyncLecturerSchedule.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';

const route = useRoute();
const back = history.state.back?.startsWith('/timetable/event') ? history.state.back : '/timetable';
</script>

<template>
	<IrdomLayout backable :back="back" share title="Преподаватель">
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
