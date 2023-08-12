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
		<h3>{{ `${course} курс` }}</h3>
		<ul ref="list" class="ul">
			<li v-for="group of groups" :key="group.id" class="li">
				<v-chip @click="setGroup(group)">{{ group.number }}</v-chip>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.ul {
	padding: 12px 0;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.section {
	margin-bottom: 16px;
	overflow: hidden;
	position: relative;

	&:last-child {
		margin-bottom: 0;
	}
}

.li {
	list-style-type: none;
}
</style>
