<script setup lang="ts">
import Icons from './icons.svg';
withDefaults(defineProps<{ size?: number; icon: string }>(), {
	size: 24
});
</script>

<template>
	<svg :width="size" :height="size">
		<use :xlink:href="`${Icons}#${icon}`"></use>
	</svg>
</template>
