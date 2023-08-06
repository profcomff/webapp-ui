<script setup lang="ts">
import { ToolbarAction, ToolbarMenuItem } from './IrdomToolbar/types';
import IrdomToolbar from './IrdomToolbar/IrdomToolbar.vue';

defineProps<{
	toolbarActions?: ToolbarAction[];
	toolbarMenu?: ToolbarMenuItem[];
	back?: string;
	title?: string;
	share?: boolean;
	backable?: boolean;
}>();
</script>

<template>
	<IrdomToolbar
		:actions="toolbarActions"
		:menu-items="toolbarMenu"
		:backable="backable"
		:back="back"
		:title="title"
		:share="share"
	>
		<slot name="toolbar" />
	</IrdomToolbar>

	<slot name="body" />

	<main class="container main" v-bind="$attrs">
		<slot />
	</main>
</template>

<style scoped>
.main {
	padding: 16px;
	display: flex;
	flex-direction: column;
	flex: 1;
}
</style>
