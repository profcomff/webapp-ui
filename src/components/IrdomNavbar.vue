<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

export interface NavbarItem {
	name: string;
	icon: string;
	path: string;
}

const props = defineProps<{
	items: Record<string, NavbarItem>;
}>();

const current = computed(() => route.path.match(/^\/\w+/)?.[0] ?? '');
const buttons = computed(() => new Set(Object.values(props.items)));
</script>

<template>
	<v-bottom-navigation grow elevation="4" mandatory>
		<v-btn
			v-for="button of buttons"
			:key="button.name"
			:active="items[current] === button"
			@click="$router.push(button.path)"
		>
			<v-icon :icon="button.icon" />
			{{ button.name }}
		</v-btn>
	</v-bottom-navigation>
</template>
