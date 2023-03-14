<script setup lang="ts">
import { IrdomLayout, ToolbarActionLink, ToolbarMenuItem } from '@/components';
import { LocalStorage, LocalStorageItem } from '@/models';
import { parseDate, stringifyDate } from '@/utils';
import DateNavigation from './DateNavigation.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import EventsList from './EventsList.vue';
import CalendarDropdown from './CalendarDropdown.vue';
import { useTimetableStore } from '@/store';

const router = useRouter();
const route = useRoute();
const timetableStore = useTimetableStore();

const toolbarActions: ToolbarActionLink[] = [
	{
		icon: 'today',
		href: `/timetable/${stringifyDate(new Date())}`,
		ariaLabel: 'Вернуться к сегодняшнему дню',
	},
];

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
	<IrdomLayout title="" :toolbar-actions="toolbarActions" :toolbar-menu="toolbarMenu">
		<template #toolbar>
			<CalendarDropdown :date="date" />
		</template>
		<template #body>
			<DateNavigation :date="date" />
		</template>

		<Suspense :key="key">
			<EventsList :date="date" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
<style scoped></style>
