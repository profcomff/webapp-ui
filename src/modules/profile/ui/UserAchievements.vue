<script setup lang="ts">
import AchievementElement from './AchievementElement.vue';
defineProps<{
	achievements: Array<{
		id: number;
		name: string;
		description: string;
		picture: string;
	}>;
	isLoading: boolean;
}>();
</script>

<template>
	<v-slide-group v-if="achievements.length > 0" :show-arrows="false" class="me-n2 pt-9 pb-2">
		<v-slide-group-item v-for="item in achievements" :key="item.id">
			<AchievementElement
				:name="item.name"
				:description="item.description"
				:picture="item.picture"
			/>
		</v-slide-group-item>
	</v-slide-group>

	<div v-else-if="isLoading" class="d-flex justify-center py-8">
		<v-progress-circular indeterminate color="primary" />
	</div>

	<div v-else class="text-center text-grey-darken-2 py-8">
		<p class="text-body-1 mb-0">У тебя еще нет достижений в приложении :(</p>
	</div>
</template>
