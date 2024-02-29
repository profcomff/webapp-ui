<script setup lang="ts">
import { computed } from 'vue';
import { TimetableApi } from '@/api';
import EventRow from '@/components/EventRow.vue';
import { useTimetableStore } from '@/store/timetable';
import { stringifyDate } from '@/utils/date';

const props = defineProps<{ date: Date }>();

const timetableStore = useTimetableStore();
const groupId = computed(() => timetableStore.group?.id);

const date = computed(() => props.date);

if (!timetableStore.days.has(stringifyDate(date.value)) && groupId.value) {
	await TimetableApi.getDayEvents(props.date, groupId.value);
}

const events = computed(() => timetableStore.days.get(stringifyDate(props.date)));
</script>

<template>
	<EventRow v-for="event of events" :key="event.id" :event="event" :info="['room', 'lecturer']" />

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
