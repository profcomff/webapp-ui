<script setup lang="ts">
import { ActionItem, IrdomLayout, ToolbarMenuItem } from '@/components';
import { LocalStorage, LocalStorageItem } from '@/models';
import { parseDate, stringifyDate } from '@/utils';
import DateNavigation from './DateNavigation.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import AsyncEventsList from './AsyncEventsList.vue';
import CalendarDropdown from './CalendarDropdown.vue';
import { useTimetableStore } from '@/store';

const router = useRouter();
const route = useRoute();
const timetableStore = useTimetableStore();

const toolbarActions = computed<ActionItem[]>(() =>
	(route.params.date as string) === stringifyDate(new Date())
		? []
		: [
				{
					icon: 'today',
					onClick: () => router.push(`/timetable/${stringifyDate(new Date())}`),
					ariaLabel: 'Вернуться к сегодняшнему дню',
				},
		  ],
);

const toolbarMenu: ToolbarMenuItem[] = [
	{
		name: 'Изменить группу',
		onClick: () => {
			LocalStorage.delete(LocalStorageItem.StudyGroup);
			timetableStore.updateGroup();
			timetableStore.days.clear();
			router.push('/timetable/init');
		},
	},
];

const date = computed(() => {
	return parseDate(route.params.date as string);
});

// HACK: на каждое изменение даты обновляем компонент Suspense
const key = ref(1);
watch(date, () => {
	key.value++;
});
</script>
<template>
	<IrdomLayout title="" :toolbar-actions="toolbarActions" :toolbar-menu="toolbarMenu" style="padding-top: 0">
		<template #toolbar>
			<CalendarDropdown :date="date" />
		</template>
		<DateNavigation :date="date" />

		<Suspense :key="key">
			<AsyncEventsList :date="date" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
