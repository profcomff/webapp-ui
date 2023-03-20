<script setup lang="ts">
import { StudyGroup } from '@/api/models';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useTimetableStore } from '@/store';
import { useRouter } from 'vue-router';

defineProps<{
	course: string;
	groups: StudyGroup[];
}>();

const router = useRouter();
const { updateGroup } = useTimetableStore();

const setGroup = (group: StudyGroup) => {
	LocalStorage.set<StudyGroup>(LocalStorageItem.StudyGroup, group);
	updateGroup();

	router.push('/timetable');
};
</script>

<template>
	<div class="section">
		<h3 class="h3">{{ `${course} курс` }}</h3>
		<ul class="ul" ref="list">
			<li class="li" v-for="group of groups" :key="group.id">
				<button type="button" class="label" @click="setGroup(group)">{{ group.number }}</button>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.label {
	padding: 4px 8px;
	background: var(--color-primary-light);
	border-radius: 999px;
}

.ul {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.h3 {
	margin-bottom: 16px;
}

.section {
	margin-bottom: 16px;
	overflow: hidden;
	position: relative;

	&:last-child {
		margin-bottom: 0;
	}
}

.more {
	position: absolute;
	bottom: 0;
	right: 0;
	background: peachpuff;
	border-radius: 999px;
	padding: 2px 4px;
}
</style>
