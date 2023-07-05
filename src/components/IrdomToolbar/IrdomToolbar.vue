<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { IrdomPopover, MaterialIcon } from '../lib';
import { ToolbarAction, ToolbarActionButton, ToolbarActionLink, ToolbarMenuItem } from './types';
import { marketingApi } from '@/api/marketing';
import { useProfileStore } from '@/store';

interface Props {
	menuItems?: ToolbarMenuItem[];
	title?: string;
	back?: string;
	actions?: ToolbarAction[];
	share?: boolean;
	backable?: boolean;
}

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();

const props = withDefaults(defineProps<Props>(), {
	menuItems: () => [],
	title: 'Твой ФФ!',
	actions: () => [],
	share: false,
	backable: false,
});

const data = {
	url: route.fullPath,
};
const canShare = navigator.canShare && navigator.canShare(data);
const shareHandler = async () => {
	await navigator.share(data);
	if (profileStore.marketingId) {
		marketingApi.writeAction({
			action: 'share',
			user_id: profileStore.marketingId,
			additional_data: JSON.stringify(data),
		});
	}
};

const onBack = () => {
	if (props.back) {
		router.push(props.back);
	} else {
		router.back();
	}
};
</script>

<template>
	<header class="toolbar">
		<div class="container wrapper">
			<div class="meta" v-if="title || back">
				<button type="button" @click="onBack" aria-label="Назад" :disabled="!backable" class="title-button">
					<MaterialIcon name="arrow_back" v-if="backable" />
					<h1 class="noselect title">{{ title }}</h1>
				</button>
			</div>

			<div>
				<slot />
			</div>

			<div class="flex">
				<div class="actions">
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
					<button
						type="button"
						@click="shareHandler"
						class="button"
						aria-label="Поделиться"
						v-if="share && canShare"
					>
						<MaterialIcon name="share" />
					</button>
				</div>
				<IrdomPopover v-if="menuItems.length > 0" style="min-width: 48px; height: 100%">
					<ul>
						<li v-for="{ name, onClick } of menuItems" :key="name">
							<button @click="onClick" class="menu-item">{{ name }}</button>
						</li>
					</ul>
				</IrdomPopover>
			</div>
		</div>
	</header>
</template>

<style scoped>
.toolbar {
	position: fixed;
	top: 0;
	z-index: 999;
	height: var(--toolbar-height);
	width: 100%;
	background: var(--color-primary-dark);
	color: white;
	box-shadow: 0 2px 4px oklch(0 0 0deg / 50%);
}

.wrapper {
	display: flex;
	justify-content: space-between;
	padding: 0 16px;
	height: 100%;
}

.menu-item {
	font-size: 16px;
	padding: 8px 16px;
}

.title {
	font-size: 18px;
	white-space: nowrap;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 24px;
}

.title-button {
	display: flex;
	align-content: center;
	gap: 8px;
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
