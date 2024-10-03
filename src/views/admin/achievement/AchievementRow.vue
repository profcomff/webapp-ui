<script setup lang="ts">
import { AchievementGet } from '@/models';
import apiClient from '@/api/';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getPictureUrl } from '@/utils/achievement';

const props = defineProps<{ achievement: AchievementGet }>();
const router = useRouter();

const name = ref(props.achievement.name);
const description = ref(props.achievement.description);
const formUpdatedValue = ref(false);

watch(name, () => (formUpdatedValue.value = true));
watch(description, () => (formUpdatedValue.value = true));

const save = (id: number, name: string, description: string) => {
	apiClient
		.PATCH('/achievement/achievement/{id}', {
			params: { path: { id } },
			body: { name, description },
		})
		.then(() => (formUpdatedValue.value = false));
};
</script>

<template>
	<tr key="id" class="row">
		<td>{{ props.achievement.id }}</td>
		<td>
			<img :src="getPictureUrl(props.achievement.picture)" height="50" width="50" />
		</td>
		<td>
			<v-text-field v-model="name" variant="underlined" />
		</td>
		<td>
			<v-text-field v-model="description" variant="underlined" />
		</td>
		<td>
			<v-btn
				:disabled="!formUpdatedValue"
				type="button"
				icon="md:save"
				variant="text"
				@click="save(props.achievement.id, name, description)"
			/>
		</td>
		<td>
			<v-btn
				type="button"
				icon="md:edit"
				variant="text"
				@click="router.push(`/admin/achievement/${props.achievement.id}`)"
			/>
		</td>
	</tr>
</template>

<style scoped>
.row {
	margin: 16px 0;
}
</style>
