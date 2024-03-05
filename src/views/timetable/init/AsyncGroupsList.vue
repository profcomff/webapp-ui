<script setup lang="ts">
import { StudyGroup } from '@/api/models';
import { timetableGroupApi } from '@/api/timetable';
import { computed } from 'vue';
import GroupsListItem from './GroupsListItem.vue';

const props = withDefaults(defineProps<{ query?: string }>(), {
	query: '',
});

const data = await timetableGroupApi.getAll({ limit: 1000 }).then(({ data }) => data.items);

const groups = computed(() => data?.filter(g => g.number.includes(props.query.trim())));

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
	<div class="grid">
		<template v-for="course in Object.keys(sorted)" :key="course">
			<GroupsListItem
				v-show="sorted[course].length"
				:course="course"
				:groups="sorted[course].sort((a, b) => parseInt(a.number) - parseInt(b.number))"
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
