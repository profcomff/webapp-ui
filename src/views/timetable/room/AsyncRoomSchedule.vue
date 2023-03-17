<script setup lang="ts">
import { TimetableApi } from '@/api';
import { EventRow } from '@/components';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

if (!timetableStore.rooms.get(props.id)?.schedule) {
	await TimetableApi.getRoomEvents(props.id);
}

const events = computed(() => timetableStore.rooms.get(props.id)?.schedule);
</script>

<template>
	<EventRow v-for="event of events" :event="event" :key="event.id" />
</template>
