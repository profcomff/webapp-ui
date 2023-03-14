<script setup lang="ts">
import { timetableEventApi } from '@/api/timetable';
import { DataRow } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { useTimetableStore } from '@/store';
import { formatTime } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

const event =
	timetableStore.events.get(props.id) ??
	(await timetableEventApi.getEvent(props.id).then(({ data }) => {
		timetableStore.events.set(props.id, data);

		for (const room of data.room) {
			timetableStore.rooms.set(room.id, room);
		}

		for (const lecturer of data.lecturer) {
			timetableStore.lecturers.set(lecturer.id, lecturer);
		}

		return data;
	}));

const scheduleTitle = computed(() =>
	event ? new Date(event.start_ts).toLocaleString('ru-RU', { day: 'numeric', month: 'long' }) : '',
);

const scheduleInfo = computed(() =>
	event ? `${formatTime(event.start_ts)} – ${formatTime(event.end_ts)}` : undefined,
);
</script>

<template>
	<h2>{{ event?.name }}</h2>

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
		v-for="{ id, first_name, middle_name, last_name } of event?.lecturer"
		:title="`${first_name} ${middle_name}`"
		:href="`/timetable/lecturer/${id}`"
		:info="last_name"
		class="row"
		clickable
		:key="id"
	>
		<MaterialIcon name="person" />
	</DataRow>
</template>

<style scoped>
.icon {
	font-size: 30px;
}

.row {
	font-size: 18px;
	margin-bottom: 8px;
	text-decoration: none;
	color: inherit;
}

.row:last-child {
	margin-bottom: 0;
}
</style>
