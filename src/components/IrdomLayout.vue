<script setup lang="ts">
import IrdomToolbar, { ToolbarActionItem, ToolbarMenuItem } from './IrdomToolbar.vue';

defineProps<{
	toolbarActions?: ToolbarActionItem[];
	toolbarMenu?: ToolbarMenuItem[];
	backUrl?: string;
	title?: string;
	share?: boolean;
	backable?: boolean;
	touch?: unknown;
	height?: string;
}>();
</script>

<template>
	<IrdomToolbar
		:actions="toolbarActions"
		:menu-items="toolbarMenu"
		:backable="backable"
		:back-url="backUrl"
		:title="title"
		:share="share"
	>
		<slot name="toolbar" />
	</IrdomToolbar>

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
