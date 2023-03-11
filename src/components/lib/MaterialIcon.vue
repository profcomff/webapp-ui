<script setup lang="ts">
interface Props {
	name: string;
	outlined?: boolean;
	size?: number;
}

withDefaults(defineProps<Props>(), {
	outlined: false,
	size: 24,
});
</script>

<template>
	<span aria-hidden="true" :class="['material-symbols-sharp', { outlined }]" :style="{fontSize: `${size}px`}">
		{{ name }}
	</span>
</template>

<style scoped>
:global(.material-symbols-sharp) {
	font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
	pointer-events: none;
	font-size: inherit;
	max-width: calc(1em + 4px);
	overflow: hidden;
	text-overflow: ellipsis;
}

.outlined {
	font-variation-settings: 'FILL' 0;
}
</style>
