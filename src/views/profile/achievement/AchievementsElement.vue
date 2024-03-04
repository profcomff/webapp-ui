<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ name: string; description: string; picture: string }>();
const overlay = ref(false);
</script>

<template>
	<v-card class="achievement" color="background" elevation="0" @click="overlay = !overlay">
		<div class="achievement-image" :style="{ 'background-image': `url(${props.picture})` }" />
		<p>{{ props.name }}</p>
		<v-tooltip v-model="overlay" activator="parent" location="bottom">
			<p color="on-surface">{{ props.description }}</p>
		</v-tooltip>
	</v-card>
</template>

<style scoped>
.achievement {
	width: 150px;
	padding: 10px;
	margin: 10px;
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
