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

	<div v-touch="touch" class="v-main-wrapper">
		<v-main>
			<v-container>
				<v-row>
					<v-col class="d-flex flex-column">
						<slot />
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</div>
</template>

<style scoped>
v-main,
.v-main-wrapper {
	height: 100%;
	width: 100%;
}
</style>
