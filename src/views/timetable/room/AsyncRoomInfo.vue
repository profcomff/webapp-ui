<script setup lang="ts">
import { TimetableApi } from '@/api/controllers/TimetableApi';
import { DataRow } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{ id: number }>();

const timetableStore = useTimetableStore();

if (!timetableStore.rooms.has(props.id)) {
	await TimetableApi.getRoom(props.id);
}

const room = computed(() => timetableStore.rooms.get(props.id));

const title = computed(() => {
	switch (room.value?.direction) {
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
</style>
