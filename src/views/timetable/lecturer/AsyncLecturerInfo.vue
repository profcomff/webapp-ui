<script setup lang="ts">
import { useTimetableStore } from '@/store';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { computed } from 'vue';
import { TimetableApi } from '@/api';

const timetableStore = useTimetableStore();

const props = defineProps<{ id: number }>();

if (!timetableStore.lecturers.has(props.id)) {
	await TimetableApi.getLecturer(props.id);
}

const lecturer = computed(() => timetableStore.lecturers.get(props.id));

const fullName = computed(() => {
	if (lecturer.value) {
		const { first_name, middle_name, last_name } = lecturer.value;
		return `${first_name} ${middle_name} ${last_name}`;
	}
	return undefined;
});

const imgUrl = computed(() =>
	lecturer.value?.avatar_link ? `${import.meta.env.VITE_API_URL}${lecturer.value?.avatar_link}` : Placeholder,
);
</script>

<template>
	<img :src="imgUrl" alt="Фотография преподавателя" class="avatar" width="256" height="256" />
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
	box-shadow: 0 0 20px oklch(0 0 0deg / 10%);
	object-fit: cover;
}

.full-name {
	align-self: center;
	text-align: center;
	margin-bottom: 64px;
}
</style>
