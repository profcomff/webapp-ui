<script setup lang="ts">
import { IrdomPopover, MaterialIcon } from '../lib';
import { ToolbarAction, ToolbarActionButton, ToolbarActionLink, ToolbarMenuItem } from './types';

interface Props {
	menuItems?: ToolbarMenuItem[];
	title?: string;
	back?: string | boolean;
	actions?: ToolbarAction[];
}

withDefaults(defineProps<Props>(), {
	menuItems: () => [],
	title: 'Твой ФФ!',
	actions: () => [],
});

const defaultBack = history.state.back;
</script>

<template>
	<header class="toolbar">
		<div class="container wrapper">
			<div class="meta" v-if="title || back">
				<RouterLink :to="back === true ? defaultBack : back" v-if="back" aria-label="Назад">
					<MaterialIcon name="arrow_back" />
				</RouterLink>
				<h1 class="noselect title">{{ title }}</h1>
			</div>

			<div>
				<slot />
			</div>

			<div class="flex">
				<div class="actions" v-if="actions.length > 0">
					<template v-for="action of actions">
						<RouterLink
							:to="(action as ToolbarActionLink).href"
							v-if="(action as ToolbarActionLink).href"
							class="button"
							:key="`link-${action.icon}`"
						>
							<MaterialIcon :name="action.icon" />
						</RouterLink>

						<button
							type="button"
							@click="(action as ToolbarActionButton).onClick"
							:aria-label="action.ariaLabel"
							class="button"
							v-else-if="(action as ToolbarActionButton).onClick"
							:key="`button-${action.icon}`"
						>
							<MaterialIcon :name="action.icon" />
						</button>
					</template>
				</div>
				<IrdomPopover v-if="menuItems.length > 0" style="min-width: 48px; height: 100%">
					<ul>
						<li v-for="{ name, onClick } of menuItems" :key="name">
							<button @click="onClick" class="menuItem">{{ name }}</button>
						</li>
					</ul>
				</IrdomPopover>
			</div>
		</div>
	</header>
</template>

<style scoped>
.toolbar {
	position: sticky;
	top: 0;
	z-index: 999;
	height: var(--toolbar-height);
	width: 100%;
	background: var(--color-primary-dark);
	color: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 50%);
}
.wrapper {
	display: flex;
	justify-content: space-between;
	padding: 0 8px;
	height: 100%;
}

.menuItem {
	font-size: 16px;
	padding: 8px 16px;
}

.title {
	font-size: 18px;
	white-space: nowrap;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
}

.button {
	font-size: 24px;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
	min-width: 48px;
	color: inherit;
}

.button:active {
	color: inherit;
}

.meta {
	display: flex;
	align-items: center;
	gap: 4px;
	max-width: 100%;
	overflow: hidden;
}

.actions {
	display: flex;
	font-size: 24px;
	align-items: center;
	gap: 8px;
}
</style>
