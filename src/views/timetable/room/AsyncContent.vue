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
	<h2 class="h2">{{ room?.name }}</h2>

	<DataRow v-if="room?.building" :title="room.building" class="row">
		<MaterialIcon name="location_on" />
	</DataRow>

	<DataRow v-if="room?.direction" :title="title" class="row">
		<MaterialIcon name="explore" />
	</DataRow>
</template>

<style scoped>
.h2 {
	margin-bottom: 16px;
}

.row {
	height: auto;
	padding: 0;
}

.row:last-of-type {
	margin-bottom: 32px;
}
</style>
