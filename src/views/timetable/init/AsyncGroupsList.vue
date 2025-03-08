<script setup lang="ts">
import { StudyGroup } from '@/models';
import { computed } from 'vue';
import GroupsListItem from './GroupsListItem.vue';
import { apiClient } from '@/api/';

const props = withDefaults(defineProps<{ query?: string }>(), {
	query: '',
});

const { data: responseData } = await apiClient.GET('/timetable/group/', {
	params: { query: { limit: 1000 } },
});
const data = responseData?.items;

const groups = computed(() =>
	data?.filter((g: StudyGroup) => g.number.includes(props.query.trim()))
);

const sorted = computed(() =>
	groups.value?.reduce(
		(acc, group: StudyGroup) => {
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
		} as Record<string, StudyGroup[]>
	)
);
</script>

<template>
	<div v-if="sorted" class="grid">
		<template v-for="course in Object.keys(sorted)" :key="course">
			<GroupsListItem
				v-show="sorted[course].length"
				:course="course"
				:groups="
					sorted[course].sort(
						(a: StudyGroup, b: StudyGroup) => parseInt(a.number) - parseInt(b.number)
					)
				"
			/>
		</template>
	</div>
</template>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px 2.5%;

	@media screen and (width <= 575px) {
		grid-template-columns: 1fr;
	}
}
</style>
