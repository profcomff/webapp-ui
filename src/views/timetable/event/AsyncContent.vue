<script setup lang="ts">
import { TimetableApi } from '@/api';
import { computed } from 'vue';
import DataRow from '@/components/DataRow.vue';
import { useTimetableStore } from '@/store/timetable';
import { formatTime } from '@/utils/time';
import MaterialIcon from '@/components/MaterialIcon.vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

const eventId = computed(() => props.id);

if (!timetableStore.events.has(eventId.value)) {
	await TimetableApi.getEvent(props.id);
}

const event = computed(() => timetableStore.events.get(props.id));

const scheduleTitle = computed(() =>
	event.value
		? new Date(event.value.start_ts).toLocaleString('ru-RU', { day: 'numeric', month: 'long' })
		: ''
);

const scheduleInfo = computed(() =>
	event.value ? `${formatTime(event.value.start_ts)} – ${formatTime(event.value.end_ts)}` : ''
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
				info: lecturerInfo({ first_name, last_name, middle_name })
			});
		}
	}

	return arr;
});
</script>

<template>
	<h2 class="h2">{{ event?.name }}</h2>

	<DataRow title="Группа" :info="event?.group.map(g => g.number).join(', ')" class="row">
		<MaterialIcon icon="group" class="icon" />
	</DataRow>

	<DataRow :title="scheduleTitle" :info="scheduleInfo" class="row">
		<MaterialIcon icon="schedule" class="icon" />
	</DataRow>

	<DataRow
		v-for="{ name, id: roomId } of event?.room"
		:key="roomId"
		:title="name"
		class="row"
		:href="`/timetable/room/${roomId}`"
		clickable
	>
		<MaterialIcon icon="location-on" />
	</DataRow>

	<DataRow
		v-for="{ id: lecturerId, info, title } of lecturers"
		:key="lecturerId"
		:title="title"
		:href="`/timetable/lecturer/${lecturerId}`"
		:info="info"
		class="row"
		clickable
	>
		<MaterialIcon icon="person" />
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
