<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ToolbarActionItem, ToolbarMenuItem } from './types';
import { marketingApi } from '@/api/marketing';
import { useProfileStore } from '@/store';

interface Props {
	menuItems?: ToolbarMenuItem[];
	title?: string;
	back?: string;
	actions?: ToolbarActionItem[];
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
	back: undefined,
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
	<v-app-bar class="overflow-visible" elevation="4">
		<template #prepend>
			<v-btn v-if="backable" icon="md:arrow_back" color="white" @click="onBack" />
			<slot />
		</template>
		<v-app-bar-title v-if="title !== ''">
			{{ title }}
		</v-app-bar-title>
		<template #append>
			<v-btn
				v-for="{ icon, onClick } in actions"
				:key="icon"
				:icon="`md:${icon}`"
				color="white"
				@click="onClick"
			/>
			<v-btn
				v-if="share && canShare"
				aria-label="Поделиться"
				color="white"
				icon="md:share"
				@click="shareHandler"
			/>
			<v-menu v-if="menuItems.length > 0">
				<template #activator="{ props: menuProps }">
					<v-btn icon="md:more_vert" v-bind="menuProps" color="white" />
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
