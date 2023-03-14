<script setup lang="ts">
defineProps<{ open: boolean }>();
</script>

<template>
	<Dialog :open="open" class="dialog">
		<slot />
	</Dialog>
</template>

<style scoped>
.dialog {
	position: absolute;
}
</style>
