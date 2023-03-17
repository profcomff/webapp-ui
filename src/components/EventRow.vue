<script setup lang="ts">
import { Event } from '@/api/models';
import { getNameWithInitials, formatTime } from '@/utils';
import { computed } from 'vue';
import DataRow from './DataRow.vue';

const props = defineProps<{ event: Event }>();

const info = computed(() => {
	const lecturers = props.event.lecturer
		?.map(({ first_name, last_name, middle_name }) =>
			getNameWithInitials({
				firstName: first_name,
				lastName: last_name,
				middleName: middle_name,
			}),
		)
		.join(', ');

	const rooms = props.event.room?.map(r => r.name).join(', ');

	return [rooms, lecturers].filter(e => Boolean(e)).join(' • ');
});
</script>

<template>
	<DataRow :title="event.name" :info="info" :href="`/timetable/event/${event.id}`" clickable :key="event.id">
		<b>{{ formatTime(event.start_ts) }}</b>
		<span>{{ formatTime(event.end_ts) }}</span>
	</DataRow>
</template>
