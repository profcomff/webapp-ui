<script setup lang="ts">
import { TimetableApi } from '@/api';
import EventRow from '@/components/EventRow.vue';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();
if (!timetableStore.lecturers.get(props.id)?.schedule) {
	await TimetableApi.getLecturerEvents(props.id);
}

const events = computed(() => timetableStore.lecturers.get(props.id)?.schedule);
</script>

<template>
	<EventRow v-for="event of events?.values()" :event="event" :key="event.id" :info="['group', 'room']" />
	<span v-if="!events?.size">У преподавателя выходной</span>
</template>
