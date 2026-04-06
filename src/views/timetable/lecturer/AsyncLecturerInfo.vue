<script setup lang="ts">
import Placeholder from '@/assets/profile_image_placeholder.webp';
import Markdown from '@/components/MarkdownRenderer.vue';
import { TimetableApi } from '@/api';
import { useTimetableStore } from '@/store/timetable';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const timetableStore = useTimetableStore();
const router = useRouter();

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
	lecturer.value?.avatar_link
		? `${import.meta.env.VITE_API_URL}${lecturer.value.avatar_link}`
		: Placeholder
);

const isLoadingRating = ref(false);

async function goToRating() {
	isLoadingRating.value = true;
	try {
		const ratingId = await TimetableApi.getRatingLecturerByTimetableId(props.id);
		if (ratingId !== undefined) {
			await router.push(`/apps/44/lecturer?lecturer_id=${ratingId}`);
		}
	} finally {
		isLoadingRating.value = false;
	}
}
</script>

<template>
	<img :src="imgUrl" alt="Фотография преподавателя" class="avatar" width="256" height="256" />
	<h2 class="full-name">{{ fullName }}</h2>

	<v-btn
		color="secondary"
		variant="flat"
		rounded="lg"
		class="rating-btn"
		:loading="isLoadingRating"
		@click="goToRating"
	>
		<template #prepend>
			<v-icon>nature</v-icon>
		</template>
		Рейтинг в «Дубинушке»
	</v-btn>

	<Markdown class="description" :text="lecturer?.description ?? ''" />
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

.rating-btn {
	align-self: center;
	margin-bottom: 16px;
}

.description {
	margin-bottom: 64px;
}
</style>
