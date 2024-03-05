<script setup lang="ts">
import { TimetableApi } from '@/api/controllers/TimetableApi';
import { computed } from 'vue';
import DataRow from '@/components/DataRow.vue';
import { useTimetableStore } from '@/store/timetable';
import MaterialIcon from '@/components/MaterialIcon.vue';

const props = defineProps<{ id: number }>();

const roomId = computed(() => props.id);

const timetableStore = useTimetableStore();

if (!timetableStore.rooms.has(roomId.value)) {
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
		<MaterialIcon icon="location-on" />
	</DataRow>

	<DataRow v-if="room?.direction" :title="title" class="row">
		<MaterialIcon icon="explore" />
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
