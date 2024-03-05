<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { marketingApi } from '@/api/marketing';
import { computed } from 'vue';
import { useProfileStore } from '@/store/profile';

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
	back?: string;
	actions?: ToolbarActionItem[];
	share?: boolean;
	backable?: boolean;
	centered?: boolean;
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
	back: undefined,
	centered: false,
});

const invisibleButtons = computed(() => {
	return props.centered
		? props.actions.length + (props.share ? 1 : 0) - (props.backable ? 1 : 0)
		: 0;
});
const leftInvisibleButtons = computed(() =>
	invisibleButtons.value > 0 ? invisibleButtons.value : 0
);
const rightInvisibleButtons = computed(() =>
	invisibleButtons.value < 0 ? -invisibleButtons.value : 0
);

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
	<v-app-bar class="overflow-visible" elevation="4">
		<template #prepend>
			<v-btn v-if="backable" icon="arrow_back" color="white" @click="onBack" />
			<v-btn v-for="index in leftInvisibleButtons" :key="index" icon />
			<slot />
		</template>
		<v-app-bar-title v-if="title !== ''" :class="centered ? 'centered-title' : ''">
			{{ title }}
		</v-app-bar-title>
		<template #append>
			<v-btn v-for="index in rightInvisibleButtons" :key="index" icon disabled />
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
.centered-title :global(.v-toolbar-title__placeholder) {
	margin-left: -16px;
}
</style>
