<script setup lang="ts">
import { stringifyDate } from '@/utils';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';
import { TimetableApi } from '@/api';
import EventRow from '@/components/EventRow.vue';

const props = defineProps<{ date: Date }>();

const timetableStore = useTimetableStore();
const groupId = computed(() => timetableStore.group?.id);

if (!timetableStore.days.has(stringifyDate(props.date)) && groupId.value) {
	await TimetableApi.getDayEvents(props.date, groupId.value);
}

const events = computed(() => timetableStore.days.get(stringifyDate(props.date)));
</script>

<template>
	<EventRow v-for="event of events" :event="event" :key="event.id" />

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
