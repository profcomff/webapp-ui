<script setup lang="ts">
import { timetableEventApi } from '@/api/timetable';
import { getDateWithDayOffset, getNameWithInitials, formatTime, stringifyDate } from '@/utils';
import { Lecturer, Room, Event } from '@/api/models';
import { DataRow } from '@/components';
import { useTimetableStore } from '@/store';
import { ref } from 'vue';

const props = defineProps<{ date: Date }>();

const timetableStore = useTimetableStore();
const group_id = timetableStore.group?.id;

const events = ref<Event[]>([]);

const fetchEvents = async () => {
	if (!group_id) {
		events.value = [];
		return;
	}

	const key = stringifyDate(props.date);

	if (timetableStore.days.has(key)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		for (const id of timetableStore.days.get(key)!) {
			if (timetableStore.events.has(id)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				events.value.push(timetableStore.events.get(id)!);
			}
		}
		return;
	}

	const { data } = await timetableEventApi.getEvents({
		group_id,
		start: props.date,
		end: getDateWithDayOffset(props.date, 1),
	});

	for (const event of data.items) {
		timetableStore.events.set(event.id, event);

		for (const room of event.room) {
			timetableStore.rooms.set(room.id, room);
		}

		for (const lecturer of event.lecturer) {
			timetableStore.lecturers.set(lecturer.id, lecturer);
		}
	}

	timetableStore.days.set(
		key,
		data.items.map(e => e.id),
	);

	events.value = data.items;
};

await fetchEvents();

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

	<span v-if="events.length === 0" class="empty"> Свободный день! </span>
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
