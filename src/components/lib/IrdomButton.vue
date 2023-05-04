<script setup lang="ts">
withDefaults(defineProps<{ icon?: boolean }>(), { icon: false });
</script>

<template>
	<button class="button" :style="{ paddingLeft: icon ? '19px' : '24px' }">
		<slot />
	</button>
</template>

<style scoped>
.button {
	--background: white;

	box-shadow: 0 1px 2px oklch(0 0 0 / 30%), 0 1px 3px 1px oklch(0 0 0 / 15%);
	padding: 10px 24px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 44px;
	background: var(--background);
}
</style>
