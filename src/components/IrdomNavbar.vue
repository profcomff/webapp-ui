<script setup lang="ts">
import { ref } from 'vue';

export interface NavbarItem {
	name: string;
	icon: string;
	path: string[];
}

const props = defineProps<{
	items: NavbarItem[];
}>();

function findFirstIndexOfStringByPrefix(arr: NavbarItem[], prefix: string) {
	console.debug('Navbar buttons are ', arr);
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].path.length; j++) {
			if (prefix.startsWith(arr[i].path[j])) {
				console.debug(`Init bottom menu element is ${i}`);
				return i;
			}
		}
	}
	return undefined;
}

const value = ref(findFirstIndexOfStringByPrefix(props.items, window.location.pathname));
</script>

<template>
	<v-bottom-navigation grow elevation="4" v-model="value" mandatory>
		<v-btn v-for="{ icon, name, path } in items" :key="name" @click="$router.push(path[0])">
			<v-icon :icon="`md:${icon}`" />
			{{ name }}
		</v-btn>
	</v-bottom-navigation>
</template>
