<script setup lang="ts">
import { achievementApi, AchievementGet } from '@/api/achievement';
import { onMounted, ref, Ref } from 'vue';
import AchievementElement from './AchievementsElement.vue';

const props = defineProps<{ userId: number }>();
const achievements: Ref<AchievementGet[]> = ref([]);
const loaded = ref(false);

onMounted(async () => {
	achievementApi.getUser(props.userId).then(resp => {
		achievements.value = resp.data.achievement;
		console.log(achievements.value);
		loaded.value = true;
	});
});
</script>

<template>
	<v-slide-group v-if="achievements.length > 0">
		<v-slide-group-item v-for="{ id, name, description, picture } in achievements" :key="id">
			<AchievementElement
				:name="name"
				:description="description"
				:picture="achievementApi.getPictureUrl(picture)"
			/>
		</v-slide-group-item>
	</v-slide-group>
	<div v-else-if="!loaded">
		<p>Загрузка...</p>
	</div>
	<div v-else>
		<p>У тебя еще нет достижений в приложении :(</p>
	</div>
</template>

<style scoped>
.achievement {
	width: 150px;
	padding: 10px;
	text-align: center;
}

.achievement > .achievement-image {
	height: 100px;
	width: 100px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.achievement > * {
	margin: 8px auto;
}
</style>
