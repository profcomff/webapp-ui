<script setup lang="ts">
import { LocalStorage, LocalStorageItem } from '@/models';
import { IrdomChip } from '@/components';
import { StudyGroup } from '@/api/models';
import { useRouter } from 'vue-router';
import { useTimetableStore } from '@/store';
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
				<IrdomChip @click="setGroup(group)">{{ group.number }}</IrdomChip>
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

.more {
	position: absolute;
	bottom: 0;
	right: 0;
	background: peachpuff;
	border-radius: 999px;
	padding: 2px 4px;
}
</style>
