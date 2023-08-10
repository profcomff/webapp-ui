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

	<div style="height: 100%; width: 100%" v-touch="touch">
		<v-main style="height: 100%">
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
