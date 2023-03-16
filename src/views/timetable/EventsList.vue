<script setup lang="ts">
import { getNameWithInitials, formatTime, stringifyDate } from '@/utils';
import { Lecturer, Room } from '@/api/models';
import { DataRow } from '@/components';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';
import { TimetableApi } from '@/api';

const props = defineProps<{ date: Date }>();

const timetableStore = useTimetableStore();

if (!timetableStore.days.has(stringifyDate(props.date))) {
	await TimetableApi.getDayEvents(props.date);
}

const events = computed(() => timetableStore.days.get(stringifyDate(props.date)));

interface FormatEventInfoArgs {
	lecturer?: Lecturer[];
	room?: Room[];
}
const formatEventInfo = ({ lecturer, room }: FormatEventInfoArgs) => {
	const lecturers = lecturer
		?.map(({ first_name, last_name, middle_name }) =>
			getNameWithInitials({
				firstName: first_name,
				lastName: last_name,
				middleName: middle_name,
			}),
		)
		.join(', ');

	const rooms = room?.map(({ name }) => name).join(', ');

	return [lecturers, rooms].filter(e => Boolean(e)).join(' • ');
};
</script>

<template>
	<DataRow
		:title="name"
		:info="formatEventInfo({ lecturer, room })"
		v-for="{ id, start_ts, end_ts, lecturer, name, room } of events"
		:href="`/timetable/event/${id}`"
		clickable
		:key="id"
	>
		<b>{{ formatTime(start_ts) }}</b>
		<span>{{ formatTime(end_ts) }}</span>
	</DataRow>

	<span v-if="events?.length === 0" class="empty"> Свободный день! </span>
</template>

<style scoped>
.empty {
	text-transform: uppercase;
	color: lightgray;
	font-weight: bold;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
}
</style>
