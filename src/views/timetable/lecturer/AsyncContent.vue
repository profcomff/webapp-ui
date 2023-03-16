<script setup lang="ts">
import { timetableLecturerApi } from '@/api/timetable';
import { useTimetableStore } from '@/store';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { computed } from 'vue';

const timetableStore = useTimetableStore();

const props = defineProps<{ id: number }>();

const lecturer =
	timetableStore.lecturers.get(props.id) ??
	(await timetableLecturerApi.getLecturer(props.id).then(({ data }) => {
		timetableStore.lecturers.set(data.id, data);
		return data;
	}));

const fullName = computed(() => {
	if (lecturer) {
		const { first_name, middle_name, last_name } = lecturer;
		return `${first_name} ${middle_name} ${last_name}`;
	}
	return undefined;
});
</script>

<template>
	<img
		:src="lecturer?.avatar_link ?? Placeholder"
		alt="Фотография преподавателя"
		class="avatar"
		width="256"
		height="256"
	/>
	<h2 class="full-name">{{ fullName }}</h2>
</template>

<style scoped>
.avatar {
	align-self: center;
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 256px;
	border-radius: 999px;
	box-shadow: 0 0 20px rgb(0 0 0 / 10%);
	object-fit: cover;
}

.full-name {
	align-self: center;
	text-align: center;
}
</style>
