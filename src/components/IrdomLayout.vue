<script setup lang="ts">
defineProps<{
	touch?: unknown;
}>();
</script>

<template>
	<div v-touch="touch" class="touch">
		<v-main class="main">
			<slot />
		</v-main>
	</div>
</template>

<style scoped>
.touch,
.main {
	width: 100%;
	height: 100%;
}

.main {
	max-width: 900px;
	padding: calc(var(--v-layout-top) + 12px) min(5%, 8px) calc(var(--v-layout-bottom) + 12px);
	margin: 0 auto;
	display: flex;
	flex-direction: column;
}
</style>
