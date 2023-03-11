<script setup lang="ts">
import { IrdomToolbar } from '@/components';
</script>

<template>
	<IrdomToolbar backable />
	<iframe :src="$route.hash.slice(1)" frameborder="0" class="iframe" />
</template>

<style scoped>
.iframe {
	flex: 1;
}
</style>
