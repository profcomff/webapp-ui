<script setup lang="ts">
import { Event } from '@/api/models';
import { computed } from 'vue';
import DataRow from './DataRow.vue';
import { getNameWithInitials } from '@/utils/personName';
import { formatTime } from '@/utils/time';

interface Props {
	event: Event;
	info: Array<'lecturer' | 'group' | 'room'>;
}
const props = defineProps<Props>();

const info = computed(() => {
	const arr: string[] = [];

	if (props.info.includes('room')) {
		arr.push(props.event.rooms?.map(room => room.name).join(', '));
	}

	if (props.info.includes('lecturer')) {
		arr.push(props.event.lecturers?.map(lecturer => getNameWithInitials(lecturer)).join(', '));
	}

	if (props.info.includes('group')) {
		arr.push(props.event.groups.map(group => group.number).join(', '));
	}

	return arr.filter(c => Boolean(c)).join(' • ');
});
const startTs = computed(() => formatTime(props.event.start_ts));
const endTs = computed(() => formatTime(props.event.end_ts));
</script>

<template>
	<DataRow
		:key="event.id"
		:title="event.name"
		:info="info"
		:href="`/timetable/event/${event.id}`"
		clickable
	>
		<time :datetime="startTs" class="start-ts">{{ startTs }}</time>
		<time :datetime="endTs">{{ endTs }}</time>
	</DataRow>
</template>

<style scoped>
.start-ts {
	font-weight: bold;
}
</style>
