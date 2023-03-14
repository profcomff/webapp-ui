<script setup lang="ts">
import { StudyGroup } from '@/api/models';
import { timetableGroupApi } from '@/api/timetable';
import { LocalStorage } from '@/models';
import { useTimetableStore } from '@/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = withDefaults(defineProps<{ query?: string }>(), {
	query: '',
});

const timetableStore = useTimetableStore();

const data =
	timetableStore.groups ??
	(await timetableGroupApi.getGroups({ limit: 1000 }).then(({ data }) => {
		timetableStore.groups = data.items;
		return data.items;
	}));

const groups = computed(() =>
	data?.filter(g => g.number.includes(props.query)).sort((a, b) => parseInt(a.number) - parseInt(b.number)),
);

const setGroup = (group: StudyGroup) => {
	LocalStorage.setGroup(group);
	router.push('/timetable');
};
</script>

<template>
	<ul class="ul">
		<li v-for="group of groups" class="li" :key="group.id">
			<button type="button" class="label" @click="setGroup(group)">{{ group.number }}</button>
		</li>
	</ul>
</template>

<style scoped>
.label {
	padding: 4px 8px;
	background: rgba(173, 216, 230, 50%);
	border-radius: 999px;
}

.ul {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
</style>
