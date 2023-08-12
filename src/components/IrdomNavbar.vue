<script setup lang="ts">
import { ref, Ref } from 'vue';

export interface NavbarItem {
	name: string;
	icon: string;
	path: string[];
}

const props = defineProps<{
	items: NavbarItem[];
}>();

const findFirstIndexOfStringByPrefix = (arr: NavbarItem[], prefix: string, result: Ref<number | undefined>) => {
	arr.forEach((ni, i) => {
		ni.path.forEach(p => {
			if (prefix.startsWith(p)) {
				result.value = i;
				return;
			}
		});
	});
	return undefined;
};

const value = ref(undefined);
findFirstIndexOfStringByPrefix(props.items, window.location.pathname, value);
</script>

<template>
	<v-bottom-navigation grow elevation="4" v-model="value" mandatory>
		<v-btn v-for="{ icon, name, path } in items" :key="name" @click="$router.push(path[0])">
			<v-icon :icon="`md:${icon}`" />
			{{ name }}
		</v-btn>
	</v-bottom-navigation>
</template>
