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

	<v-main>
		<v-container>
			<v-row>
				<v-col class="d-flex flex-column">
					<slot />
				</v-col>
			</v-row>
		</v-container>
	</v-main>
</template>
