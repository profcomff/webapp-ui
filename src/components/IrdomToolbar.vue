<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore } from '@/store/profile';
import apiClient from '@/api/';

export interface ToolbarMenuItem {
	name: string;
	onClick: () => void;
}

export interface ToolbarActionItem {
	icon: string;
	ariaLabel: string;
	onClick: (event: MouseEvent) => void;
}

interface Props {
	menuItems?: ToolbarMenuItem[];
	title?: string;
	backUrl?: string;
	actions?: ToolbarActionItem[];
	share?: boolean;
	backable?: boolean;
	centered?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	menuItems: () => [],
	title: 'Твой ФФ!',
	actions: () => [],
	share: false,
	backable: false,
	backUrl: undefined,
});

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();

const data = {
	url: route.fullPath,
};
const canShare = navigator.canShare && navigator.canShare(data);
const shareHandler = async () => {
	await navigator.share(data);
	if (profileStore.marketingId) {
		apiClient.POST('/marketing/v1/action', {
			body: {
				action: 'share',
				user_id: profileStore.marketingId,
				additional_data: JSON.stringify(data),
			},
		});
	}
};

const onBack = () => {
	if (props.backUrl) {
		router.push(props.backUrl);
	} else {
		router.back();
	}
};
</script>

<template>
	<v-app-bar class="toolbar" elevation="4">
		<template #prepend>
			<v-btn v-if="backable" icon="arrow_back" color="white" @click="onBack" />
			<slot />
		</template>
		<v-app-bar-title v-if="title !== ''">
			{{ title }}
		</v-app-bar-title>
		<template #append>
			<v-btn
				v-for="{ icon, onClick } in actions"
				:key="icon"
				:icon="icon"
				color="white"
				@click="onClick"
			/>
			<v-btn
				v-if="share && canShare"
				aria-label="Поделиться"
				color="white"
				icon="share"
				@click="shareHandler"
			/>
			<v-menu v-if="menuItems.length > 0">
				<template #activator="{ props: menuProps }">
					<v-btn v-bind="menuProps" color="white" icon="more_vert" />
				</template>
				<v-list>
					<v-list-item v-for="{ name, onClick } of menuItems" :key="name" @click="onClick">
						{{ name }}
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-app-bar>
</template>
<style scoped>
.toolbar :global(.v-toolbar__content) {
	overflow: visible !important;
}
</style>
