<script setup lang="ts">
import EventRow from '@/components/EventRow.vue';
import { TimetableApi } from '@/api';
import { computed } from 'vue';
import { useTimetableStore } from '@/store';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

const lecturerId = computed(() => props.id);

if (!timetableStore.lecturers.get(lecturerId.value)?.schedule) {
	await TimetableApi.getLecturerEvents(props.id);
}

const events = computed(() => timetableStore.lecturers.get(props.id)?.schedule);
</script>

<template>
	<EventRow v-for="event of events?.values()" :key="event.id" :event="event" :info="['group', 'room']" />
	<span v-if="!events?.size">У преподавателя выходной</span>
</template>
