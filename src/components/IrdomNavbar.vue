<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

export interface NavbarItem {
	name: string;
	icon: string;
	path: string[];
}

const props = defineProps<{
	items: NavbarItem[];
}>();

const items = computed(() => props.items);

const current = ref(0);

items.value.forEach((item, index) => {
	item.path.forEach(path => {
		if (route.path.startsWith(path)) {
			current.value = index;
			return;
		}
	});
});
</script>

<template>
	<v-bottom-navigation v-model="current" grow elevation="4" mandatory>
		<v-btn v-for="{ icon, name, path } in items" :key="name" @click="$router.push(path[0])">
			<v-icon :icon="`md:${icon}`" />
			{{ name }}
		</v-btn>
	</v-bottom-navigation>
</template>
