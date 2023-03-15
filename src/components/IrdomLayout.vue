<script setup lang="ts">
import IrdomToolbar from './IrdomToolbar/IrdomToolbar.vue';
import { ToolbarAction, ToolbarMenuItem } from './IrdomToolbar/types';

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

	<main class="container main" v-bind="$props">
		<slot />
	</main>
</template>

<style scoped>
.main {
	padding: 16px;
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow-y: auto;
}
</style>
