<script setup lang="ts">
defineProps<{
	name: string;
	description: string;
	picture: string;
}>();
</script>

<template>
	<v-card
		class="achievement-card bg-grey-lighten-4 rounded-lg pa-3 ma-2 d-flex flex-column align-center cursor-pointer"
		elevation="0"
	>
		<v-avatar class="rounded-circle overflow-hidden mt-1" size="64">
			<v-img :src="picture" :alt="name" cover aspect-ratio="1" />
		</v-avatar>
		<p class="text-body-1 mt-2 text-center">
			{{ name }}
		</p>
		<v-tooltip activator="parent" location="bottom">
			<p color="on-surface">{{ description }}</p>
		</v-tooltip>
	</v-card>
</template>

<style scoped>
.achievement-card {
	width: 136px;
	height: 144px;
	transition: transform 0.2s ease;
}

.achievement-card:hover {
	transform: translateY(-4px);
}
</style>
