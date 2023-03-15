<script setup lang="ts">
import { timetableRoomApi } from '@/api/timetable';
import { DataRow } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

const room =
	timetableStore.rooms.get(props.id) ??
	(await timetableRoomApi.getRoom(props.id).then(({ data }) => {
		timetableStore.rooms.set(props.id, data);
		return data;
	}));

const title = computed(() => {
	switch (room?.direction) {
		case 'North':
			return 'Север (от входа налево)';
		case 'South':
			return 'Юг (от входа направо)';
		default:
			return '';
	}
});
</script>

<template>
	<h2>{{ room?.name }}</h2>

	<DataRow v-if="room?.direction" :title="title">
		<MaterialIcon name="explore" />
	</DataRow>
</template>
