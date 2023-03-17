<script setup lang="ts">
import { IrdomToolbar } from '@/components';

const back =
	history.state.back?.startsWith('/apps') || history.state.back?.startsWith('/timetable')
		? history.state.back
		: '/apps';
</script>

<template>
	<IrdomToolbar backable :back="back" />
	<iframe :src="$route.hash.slice(1)" frameborder="0" class="iframe" />
</template>

<style scoped>
.iframe {
	flex: 1;
}
</style>
