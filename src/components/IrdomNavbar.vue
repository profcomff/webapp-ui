<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import MaterialIcon from './MaterialIcon.vue';
const route = useRoute();

export interface NavbarItem {
	name: string;
	icon: string;
	path: string;
}

const props = defineProps<{
	items: Record<string, NavbarItem>;
}>();

const current = ref(props.items[route.path]);

const items = computed(() => new Set(Object.values(props.items)));
</script>

<template>
	<v-bottom-navigation v-model="current" grow elevation="4" mandatory>
		<v-btn v-for="{ icon, name, path } of items" :key="name" @click="$router.push(path)">
			<material-icon :icon="icon" />
			{{ name }}
		</v-btn>
	</v-bottom-navigation>
</template>
