<script setup lang="ts">
defineProps<{
	touch?: unknown;
}>();
</script>

<template>
	<v-main class="main">
		<v-container class="container">
			<slot />
		</v-container>
	</v-main>
</template>

<style scoped>
.main,
.container {
	width: 100%;
	height: 100%;
}

.container {
	display: flex;
	flex-direction: column;
}
</style>
