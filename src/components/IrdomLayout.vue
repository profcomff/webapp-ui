<script setup lang="ts">
import IrdomToolbar from './IrdomToolbar/IrdomToolbar.vue';
import { ToolbarMenuItem, ToolbarActionItem } from './IrdomToolbar/types';

defineProps<{
	toolbarActions?: ToolbarActionItem[];
	toolbarMenu?: ToolbarMenuItem[];
	back?: string;
	title?: string;
	share?: boolean;
	backable?: boolean;
	touch?: unknown;
	height?: string;
	className?: string;
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
		:class="className"
	>
		<slot name="toolbar" />
	</IrdomToolbar>

	<div v-touch="touch" class="v-main-wrapper">
		<v-main class="main">
			<v-container class="container">
				<slot />
			</v-container>
		</v-main>
	</div>
</template>

<style scoped>
.main,
.container,
.v-main-wrapper {
	height: 100%;
	width: 100%;
}

.profile-toolbar {
	height: 165px !important;
	z-index: 1 !important;
	position: absolute !important;
	text-align: center !important;
}

.profile-toolbar :global(.v-toolbar-title__placeholder) {
	margin-left: 3%;
}

.container {
	display: flex;
	flex-direction: column;
}
</style>
