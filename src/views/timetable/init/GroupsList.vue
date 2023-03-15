<script setup lang="ts">
import { StudyGroup } from '@/api/models';
import { timetableGroupApi } from '@/api/timetable';
import { LocalStorage, LocalStorageItem } from '@/models';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = withDefaults(defineProps<{ query?: string }>(), {
	query: '',
});

const { updateGroup } = useTimetableStore();

const data = await timetableGroupApi.getGroups({ limit: 1000 }).then(({ data }) => data.items);

const groups = computed(() => data?.filter(g => g.number.includes(props.query)));

const setGroup = (group: StudyGroup) => {
	LocalStorage.set<StudyGroup>(LocalStorageItem.StudyGroup, group);
	updateGroup();

	router.push('/timetable');
};

const sorted = computed(() =>
	groups.value.reduce(
		(acc, group) => {
			for (let i = 1; i <= 6; ++i) {
				if (group.number[0] === `${i}`) {
					if (group.number.slice(-2).includes('м')) {
						acc[`${i}м`].push(group);
					} else {
						acc[`${i}`].push(group);
					}
				}
			}
			return acc;
		},
		{
			'1': [],
			'2': [],
			'3': [],
			'4': [],
			'5': [],
			'6': [],
			'1м': [],
			'2м': [],
		} as Record<string, StudyGroup[]>,
	),
);
</script>

<template>
	<section v-for="course in Object.keys(sorted)" :key="course" class="section" v-show="sorted[course].length">
		<h3 class="h3">{{ `${course} курс` }}</h3>
		<ul class="ul">
			<li class="li" v-for="group of sorted[course]" :key="group.id">
				<button type="button" class="label" @click="setGroup(group)">{{ group.number }}</button>
			</li>
		</ul>
	</section>
</template>

<style scoped>
.label {
	padding: 4px 8px;
	background: rgb(173 216 230 / 50%);
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
}

.section:last-child {
	margin-bottom: 0;
}
</style>
