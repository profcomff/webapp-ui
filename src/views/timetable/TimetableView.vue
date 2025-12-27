<script setup lang="ts">
import DateNavigation from './DateNavigation.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import AsyncEventsList from './AsyncEventsList.vue';
import CalendarDropdown from './CalendarDropdown.vue';
import { useTimetableStore } from '@/store/timetable';
import { stringifyDate, getDateWithDayOffset, parseLocalYmdDate } from '@/utils/date';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

const router = useRouter();
const route = useRoute();
const timetableStore = useTimetableStore();
const toolbar = useToolbar();

toolbar.setup({
	title: '',
	actions: [
		{
			icon: 'today',
			onClick: () => router.push(`/timetable/${stringifyDate(new Date())}`),
			ariaLabel: 'Вернуться к сегодняшнему дню',
		},
	],
	menuItems: [
		{
			name: 'Изменить группу',
			onClick: () => {
				LocalStorage.delete(LocalStorageItem.StudyGroup);
				timetableStore.updateGroup();
				timetableStore.days.clear();
				router.push('/timetable/init');
			},
		},
	],
});

const date = computed(() => {
	return parseLocalYmdDate(route.params.date as string);
});

// HACK: на каждое изменение даты обновляем компонент Suspense
const key = ref(1);
watch(date, () => {
	key.value++;
});
</script>
<template>
	<IrdomLayout
		:touch="{
			left: () => router.push(`/timetable/${stringifyDate(getDateWithDayOffset(date, 1))}`),
			right: () => router.push(`/timetable/${stringifyDate(getDateWithDayOffset(date, -1))}`),
		}"
	>
		<template #toolbar>
			<CalendarDropdown :date="date" />
		</template>
		<DateNavigation :date="date" />

		<Suspense :key="key">
			<AsyncEventsList :date="date" />

			<template #fallback> <FullscreenLoader /> </template>
		</Suspense>
	</IrdomLayout>
</template>
