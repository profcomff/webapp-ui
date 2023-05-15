<script setup lang="ts">
import { TimetableApi } from '@/api';
import { DataRow } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { useTimetableStore } from '@/store';
import { formatTime } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

if (!timetableStore.events.has(props.id)) {
	await TimetableApi.getEvent(props.id);
}

const event = computed(() => timetableStore.events.get(props.id));

const scheduleTitle = computed(() =>
	event.value ? new Date(event.value.start_ts).toLocaleString('ru-RU', { day: 'numeric', month: 'long' }) : '',
);

const scheduleInfo = computed(() =>
	event.value ? `${formatTime(event.value.start_ts)} – ${formatTime(event.value.end_ts)}` : '',
);

interface TitleArgs {
	first_name: string;
	middle_name: string;
	last_name: string;
}

const lecturerTitle = ({ first_name, middle_name, last_name }: TitleArgs) => {
	if (first_name[1] === '.') {
		return `${first_name} ${middle_name} ${last_name}`;
	}
	return `${first_name} ${middle_name}`;
};

const lecturerInfo = ({ first_name, last_name }: TitleArgs) => {
	if (first_name[1] === '.') {
		return '';
	}
	return last_name;
};

interface Lecturer {
	id: number;
	title: string;
	info: string;
}

const lecturers = computed(() => {
	const arr: Lecturer[] = [];

	if (event.value?.lecturer) {
		for (const { id, first_name, middle_name, last_name } of event.value.lecturer) {
			arr.push({
				id,
				title: lecturerTitle({ first_name, middle_name, last_name }),
				info: lecturerInfo({ first_name, last_name, middle_name }),
			});
		}
	}

	return arr;
});
</script>

<template>
	<h2 class="h2">{{ event?.name }}</h2>

	<DataRow title="Группа" :info="event?.group.number" class="row">
		<MaterialIcon name="group" class="icon" />
	</DataRow>

	<DataRow :title="scheduleTitle" :info="scheduleInfo" class="row">
		<MaterialIcon name="schedule" class="icon" />
	</DataRow>

	<DataRow
		v-for="{ name, id } of event?.room"
		:title="name"
		class="row"
		:href="`/timetable/room/${id}`"
		:key="id"
		clickable
	>
		<MaterialIcon name="location_on" />
	</DataRow>

	<DataRow
		v-for="{ id, info, title } of lecturers"
		:title="title"
		:href="`/timetable/lecturer/${id}`"
		:info="info"
		class="row"
		clickable
		:key="id"
	>
		<MaterialIcon name="person" />
	</DataRow>
</template>

<style scoped>
.icon {
	background: white;
	font-size: 30px;
}

.row {
	font-size: 18px;
	text-decoration: none;
	color: inherit;
}

.row:last-child {
	margin-bottom: 0;
}

.h2 {
	margin-bottom: 16px;
}
</style>
