<script setup lang="ts">
import { EventRow } from '@/components';
import { TimetableApi } from '@/api';
import { computed } from 'vue';
import { useTimetableStore } from '@/store';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();
const roomId = computed(() => props.id);

if (!timetableStore.rooms.get(roomId.value)?.schedule) {
	await TimetableApi.getRoomEvents(props.id);
}

const events = computed(() => timetableStore.rooms.get(props.id)?.schedule);
</script>

<template>
	<EventRow v-for="event of events?.values()" :key="event.id" :event="event" :info="['lecturer', 'group']" />
	<span v-if="!events?.size">В аудитории нет пар</span>
</template>
