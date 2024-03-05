<script setup lang="ts">
import { Event } from '@/api/models';
import { computed } from 'vue';
import DataRow from './DataRow.vue';
import { getNameWithInitials } from '@/utils/personName';
import { formatTime } from '@/utils/time';

const props = defineProps<{ event: Event; info: Array<'lecturer' | 'group' | 'room'> }>();

const info = computed(() => {
	const arr: string[] = [];

	if (props.info.includes('room')) {
		arr.push(props.event.room?.map(r => r.name).join(', '));
	}

	if (props.info.includes('lecturer')) {
		arr.push(
			props.event.lecturer
				?.map(({ first_name, last_name, middle_name }) =>
					getNameWithInitials({
						firstName: first_name,
						lastName: last_name,
						middleName: middle_name
					})
				)
				.join(', ')
		);
	}

	if (props.info.includes('group')) {
		arr.push(props.event.group.map(g => g.number).join(', '));
	}

	return arr.filter(c => Boolean(c)).join(' • ');
});
</script>

<template>
	<DataRow
		:key="event.id"
		:title="event.name"
		:info="info"
		:href="`/timetable/event/${event.id}`"
		clickable
	>
		<b>{{ formatTime(event.start_ts) }}</b>
		<span>{{ formatTime(event.end_ts) }}</span>
	</DataRow>
</template>
